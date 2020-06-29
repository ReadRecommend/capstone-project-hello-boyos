from flask import abort, jsonify, request, Response
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash

from backend import app, db
from backend.model.schema import *


@app.route("/")
@cross_origin()
def home():
    return "Hello"


@app.route("/book")
def get_books():
    books = Book.query.all()
    return jsonify(books_schema.dump(books))


@app.route("/book/<isbn>")
def get_book(isbn):
    book = Book.query.filter_by(isbn=isbn).first_or_404()
    return book_schema.dump(book)


@app.route("/book", methods=["POST"])
def add_book():
    book_data = request.json.get("book")
    try:
        book = Book(**book_data)

        if genres := request.json.get("genres", None):
            for genre_data in genres:
                if existing_genre := Genre.query.filter_by(
                    name=genre_data.get("name")
                ).first():
                    book.genres.append(existing_genre)
                else:
                    new_genre = Genre(**genre_data)
                    book.genres.append(new_genre)

        if authors := request.json.get("authors", None):
            for author_data in authors:
                if existing_author := Author.query.filter_by(
                    name=author_data.get("name")
                ).first():
                    book.authors.append(existing_author)
                else:
                    new_author = Author(**author_data)
                    book.authors.append(new_author)

        db.session.add(book)
        db.session.commit()
        return book_schema.dump(book)
    except Exception as error:
        return abort(400, error)


@app.route("/user", methods=["POST"])
def add_reader():
    reader_data = request.json
    if Reader.query.filter(
        (Reader.email == reader_data.get("email"))
        | (Reader.username == reader_data.get("username"))
    ).first():
        return abort(403, "The readername or email already exists")

    new_reader = Reader(
        username=reader_data["username"],
        email=reader_data["email"],
        password=generate_password_hash(reader_data["password"]),
    )

    main_collection = Collection(name="main")
    new_reader.collections.append(main_collection)
    db.session.add(new_reader)
    db.session.commit()
    return reader_schema.dump(new_reader)


@app.route("/user/<username>")
def get_reader(username):
    readers = Reader.query.filter_by(username=username).first_or_404()
    return jsonify(reader_schema.dump(readers))


@app.route("/user")
def get_readers():
    readers = Reader.query.all()
    return jsonify(readers_schema.dump(readers))


@app.route("/genre")
def get_genres():
    genres = Genre.query.all()
    return jsonify(genres_schema.dump(genres))


@app.route("/author")
def get_authors():
    authors = Author.query.all()
    return jsonify(authors_schema.dump(authors))


@app.route("/followers/<username>")
def get_followers(username):
    reader = Reader.query.filter_by(username=username).first()
    followers = reader.followers
    return jsonify(readers_schema.dump(followers))


@app.route("/following/<username>")
def get_following(username):
    reader = Reader.query.filter_by(username=username).first()
    followings = reader.follows
    return jsonify(readers_schema.dump(followings))


@app.route("/follow", methods=["POST", "DELETE"])
def follow():
    follower_username = request.json.get("follower")
    reader_username = request.json.get("user")
    if not (follower_username and reader_username):
        return abort(
            400,
            r"Request should be of the form {follower: <username>, user: <username>}",
        )
    reader = Reader.query.filter_by(username=reader_username).first()
    follower = Reader.query.filter_by(username=follower_username).first()

    # Add the follower relationship if it does not exist
    if request.method == "POST" and follower not in reader.followers:
        reader.followers.append(follower)
        db.session.add(reader)
        db.session.commit()

    # Remove the follower relationship if it exists
    elif request.method == "DELETE" and follower in reader.followers:
        reader.followers.remove(follower)
        db.session.add(reader)
        db.session.commit()

    return jsonify(readers_schema.dump(follower.follows))


@app.route("/collection/<collection_ID>")
def get_collection(collection_ID):
    collection = Collection.query.filter_by(id=collection_ID).first_or_404()
    return jsonify(collection_schema.dump(collection))


@app.route("/modify_collection", methods=["POST", "DELETE"])
def modify_collection():
    print(request.json)
    collection_id = request.json.get("collection_id")
    book_id = request.json.get("book_id")
    if not (collection_id and book_id):
        return abort(
            400, r"Request should be of the form {collection_id: <id>, book_id: <id>}",
        )
    collection = Collection.query.filter_by(id=collection_id).first()
    book = Book.query.filter_by(isbn=book_id).first()

    # Add the chosen book to the collection, if it's not already there.
    if request.method == "POST" and book not in collection.books:
        collection.books.append(book)
        db.session.add(collection)
        db.session.commit()

    # Remove the book from the collection if it is in it.
    elif request.method == "DELETE" and book in collection.books:
        collection.books.remove(book)
        db.session.add(collection)
        db.session.commit()

    return jsonify(collection_schema.dump(collection))


@app.route("/collection", methods=["POST", "DELETE"])
def add_collection():
    collection_data = request.json
    reader_id = collection_data.get("reader_id")
    collection_name = collection_data.get("name")

    # Check proper fields exist
    if not (reader_id and collection_name):
        return Response(
            r"Request should be of the form {reader_id: <user_id>, name: <collection_name>}",
            status=400,
        )

    # Ensure we are not trying to delete or create main
    if collection_name == "Main":
        return Response(r"Cannot create or delete a collection called Main", status=403)

    reader = Reader.query.filter_by(id=reader_id).first()
    collection = Collection.query.filter_by(
        reader_id=reader_id, name=collection_name
    ).first()

    # Check reader exists
    if not reader:
        return Response(r"Reader is not in the database", status=403)

    # If we are making a new collection
    if request.method == "POST":
        # Ensure there isn't an already existing collection
        if collection:
            return Response(
                r"A collection with this name already exists for this user", status=403
            )

        # Create a new collection
        new_collection = Collection(name=collection_name, reader_id=reader_id)
        db.session.add(new_collection)
        db.session.commit()

    elif request.method == "DELETE":
        # Ensure there is an already existing collection
        if not collection:
            return Response(
                r"A collection with this name does not exist for this user", status=403
            )

        # Remove the collection
        db.session.delete(collection)
        db.session.commit()

    return reader_schema.dump(reader)
