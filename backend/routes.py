from flask import jsonify, request
from flask_cors import cross_origin
import flask_praetorian

from backend import app, db, guard
from backend.model.schema import *
from backend.errors import InvalidRequest, AuthenticationError, ResourceExists


@app.route("/")
@cross_origin()
def home():
    return "ReadReccomend"


# =======================
# * BOOK ROUTES
# =======================


@app.route("/book")
def get_books():
    books = Book.query.all()
    return jsonify(books_schema.dump(books))


@app.route("/book/<isbn>")
def get_book(isbn):
    book = Book.query.filter_by(isbn=isbn).first_or_404()
    return book_schema.dump(book)


# =======================
# * USER ROUTES
# =======================


@app.route("/createaccount", methods=["POST"])
def add_reader():
    reader_data = request.json
    if Reader.query.filter(
        (Reader.email == reader_data.get("email"))
        | (Reader.username == reader_data.get("username"))
    ).first():
        raise ResourceExists("The username or email already exists")

    new_reader = Reader(
        username=reader_data["username"],
        email=reader_data["email"],
        password=guard.hash_password(reader_data["password"]),
    )

    main_collection = Collection(name="Main")
    new_reader.collections.append(main_collection)
    db.session.add(new_reader)
    db.session.commit()
    return reader_schema.dump(new_reader)


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    if not (username and password):
        raise InvalidRequest(
            r"Request should be of the form {username: <username>, password: <password>}",
        )

    reader = guard.authenticate(username, password)
    return jsonify({"access_token": guard.encode_jwt_token(reader)}), 200


@app.route("/user/<username>")
def get_reader(username):
    readers = Reader.query.filter_by(username=username).first_or_404()
    return jsonify(reader_schema.dump(readers))


@app.route("/user")
def get_readers():
    readers = Reader.query.all()
    return jsonify(readers_schema.dump(readers))


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
@flask_praetorian.auth_required
def follow():
    follower_username = request.json.get("follower")
    reader_username = request.json.get("user")

    # Only the follower can request to follow
    if follower_username != flask_praetorian.current_user().username:
        raise AuthenticationError(
            "You do not have the correct authorisation to access this resource"
        )

    if not (follower_username and reader_username):
        raise InvalidRequest(
            r"Request should be of the form {follower: <username>, user: <username>}",
        )
    reader = Reader.query.filter_by(username=reader_username).first()
    follower = Reader.query.filter_by(username=follower_username).first()

    # Add the follower relationship if it does not exist
    if request.method == "POST" and follower not in reader.followers:
        reader.followers.append(follower)
        db.session.add(reader)
        db.session.commit()


# =======================
# * Collection Routes
# =======================


@app.route("/collection")
def add_collection():
    collections = Collection.query.all()
    return jsonify(collections_schema.dump(collections))


# Get the books in a collection
@app.route("/collection/<collectionID>")
def get_collection(collectionID):

    collection = Collection.query.filter_by(id=collectionID).first_or_404()
    return jsonify(collection_schema.dump(collection))


# Gets User's collections
@app.route("/user/<username>/collections")
def get_reader_collections(username):

    ReaderID = Reader.query.filter(Reader.username == username).first().id

    ReaderCollection = Collection.query.filter(Collection.reader_id == ReaderID).all()

    return jsonify(collections_schema.dump(ReaderCollection))


# =======================
# * MISC ROUTES
# =======================


@app.route("/genre")
def get_genres():
    genres = Genre.query.all()
    return jsonify(genres_schema.dump(genres))


@app.route("/author")
def get_authors():
    authors = Author.query.all()
    return jsonify(authors_schema.dump(authors))
