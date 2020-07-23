from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.collection import collection_bp
from backend.errors import AuthenticationError, InvalidRequest, ResourceNotFound
from backend.model.schema import (
    Book,
    Collection,
    Reader,
    collection_schema,
    reader_schema,
)

# Get the books in a collection
@collection_bp.route("/<collectionID>")
def get_collection(collectionID):

    collection = Collection.query.filter_by(id=collectionID).first_or_404()
    return jsonify(collection_schema.dump(collection))


@collection_bp.route("", methods=["POST", "DELETE"])
@flask_praetorian.auth_required
def add_collection():
    collection_data = request.json
    reader_id = collection_data.get("reader_id")
    collection_name = collection_data.get("name")

    # Check proper fields exist
    if not (reader_id and collection_name):
        raise InvalidRequest(
            "Request should be of the form {reader_id: 'user_id', name: 'collection_name'}",
        )

    # Ensure we are not trying to delete or create main
    if collection_name == "Main" or collection_name == "Recently Read":
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


# TODO ensure only the user who owns the collection can modify it
@collection_bp.route("/modify", methods=["POST", "DELETE"])
@flask_praetorian.auth_required
def modify_collection():
    print(request.json)
    collection_id = request.json.get("collection_id")
    book_id = request.json.get("book_id")
    reader_id = request.json.get("reader_id")

    if not (collection_id and book_id):
        raise InvalidRequest(
            "Request should be of the form {{'collection_id': id, 'book_id': id}}",
        )
    collection = Collection.query.filter_by(id=collection_id).first()
    book = Book.query.filter_by(id=book_id).first()
    reader_id = collection.reader_id

    if reader_id != flask_praetorian.current_user().id:
        raise AuthenticationError("You can only add/delete your own collections")

    # Add the chosen book to the collection, if it's not already there.
    if request.method == "POST" and book not in collection.books:
        if collection.name == "Recently Read":
            return InvalidRequest("You cannot manually add books to your recently read")
        collection.books.append(book)
        db.session.add(collection)
        db.session.commit()

    # Remove the book from the collection if it is in it.
    elif request.method == "DELETE" and book in collection.books:
        collection.books.remove(book)
        db.session.add(collection)
        db.session.commit()

    return jsonify(collection_schema.dump(collection))
