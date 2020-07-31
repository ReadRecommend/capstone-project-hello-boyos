from datetime import datetime

from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.collection import collection_bp
from backend.errors import AuthenticationError, InvalidRequest, ResourceNotFound
from backend.goals.utils import decrease_goal, increase_goal
from backend.model.schema import (
    Book,
    Collection,
    Reader,
    collection_schema,
    reader_schema,
)
from backend.user.utils import get_all_books
from backend.utils import extract_integer, extract_integers


# Get the books in a collection
@collection_bp.route("/<collection_id>")
def get_collection(collection_id):
    if not collection_id.isdigit():
        raise InvalidRequest("A collection's ID should be a positive integer")

    collection = Collection.query.filter_by(id=collection_id).first()
    if not collection:
        raise ResourceNotFound("A collection with this ID does not exist")
    return jsonify(collection_schema.dump(collection))


@collection_bp.route("", methods=["POST", "DELETE"])
@flask_praetorian.roles_required("user")
def add_collection():
    collection_data = request.json
    reader_id = extract_integer(collection_data, "reader_id")
    collection_name = collection_data.get("name")

    if not (collection_name):
        raise InvalidRequest(
            "Request should be of the form {{reader_id: 'user_id', name: 'collection_name'}}"
        )

    # Ensure we are not trying to delete or create main
    if collection_name == "Main":
        raise InvalidRequest("Cannot create or delete a collection with this name")

    if reader_id != flask_praetorian.current_user().id:
        raise AuthenticationError("You can only add/delete your own collections")

    reader = Reader.query.filter_by(id=reader_id).first()
    collection = Collection.query.filter_by(
        reader_id=reader_id, name=collection_name
    ).first()

    # Check reader exists
    if not reader:
        raise ResourceNotFound(r"Reader is not in the database")

    # If we are making a new collection
    if request.method == "POST":
        # Ensure there isn't an already existing collection with this name for this user
        if collection:
            raise InvalidRequest(
                r"A collection with this name already exists for this user"
            )

        # Create a new collection
        new_collection = Collection(name=collection_name, reader_id=reader_id)
        db.session.add(new_collection)
        db.session.commit()

    elif request.method == "DELETE":
        # Ensure the collection exists
        if not collection:
            return ResourceNotFound(
                r"A collection with this name does not exist for this user"
            )

        # Remove the collection
        db.session.delete(collection)
        db.session.commit()

    return jsonify(reader_schema.dump(reader))


@collection_bp.route("/modify", methods=["POST", "DELETE"])
@flask_praetorian.roles_required("user")
def modify_collection():
    collection_id, book_id = extract_integers(
        request.json, ["collection_id", "book_id"]
    )

    collection = Collection.query.filter_by(id=collection_id).first()
    book = Book.query.filter_by(id=book_id).first()
    user = flask_praetorian.current_user()

    if user.id != collection.reader_id:
        raise AuthenticationError("You can only add/delete your own collections")

    # Add the chosen book to the collection, if it's not already there.
    if request.method == "POST" and book not in collection.books:
        # Check if this book already exists in our all collection. If it doesn't, we need to update goals.
        all_books = get_all_books(user)
        if not (book in all_books):
            # Increase n_read of goal
            year = datetime.now().year
            month = datetime.now().month
            increase_goal(user.id, month, year)

        # Add book to collection
        collection.books.append(book)
        db.session.add(collection)
        db.session.commit()

    # Remove the book from the collection if it is in it.
    elif request.method == "DELETE" and book in collection.books:
        # Remove book from collection
        collection.books.remove(book)
        db.session.add(collection)
        db.session.commit()

        # Check if the book is still somewhere in our all collection after deletion.
        # If it isn't, we need to update goals
        all_books = get_all_books(user)
        if book not in all_books:
            # Decrease the n_read value of the goal for this month
            year = datetime.now().year
            month = datetime.now().month
            decrease_goal(user.id, month, year)

    return jsonify(collection_schema.dump(collection))
