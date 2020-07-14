import flask_praetorian
from flask import Response, abort, jsonify, request
from flask_cors import cross_origin

from backend import app, db, guard
from backend.errors import (
    AuthenticationError,
    InvalidRequest,
    ResourceExists,
    ResourceNotFound,
)
from backend.model.schema import *


@app.route("/")
@cross_origin()
def home():
    return "ReadRecommend"


# =======================
# * BOOK ROUTES
# =======================


@app.route("/book", methods=["POST"])
@flask_praetorian.roles_required("admin")
def new_book():
    bookData = request.json
    isbn = bookData.get("isbn")
    title = bookData.get("title")
    authors = bookData.get("authors")
    genres = bookData.get("genres")
    publisher = bookData.get("publisher")
    publicationDate = bookData.get("publicationDate")
    summary = bookData.get("summary")
    cover = bookData.get("cover")
    language = bookData.get("language")

    # Ensure request is valid format
    if not (title and isbn):
        raise InvalidRequest(
            "Request should be of the form {{isbn: 'isbn', title: 'title'}}"
        )

    # Check if a Book with this title/isbn already exists
    if Book.query.filter((Book.isbn == isbn) | (Book.title == title)).first():
        raise ResourceExists("A book with this title/isbn already exists")

    # Create new book
    newBook = Book(
        isbn=isbn,
        title=bookData.get("title"),
        publisher=publisher,
        publication_date=publicationDate,
        summary=summary,
        cover=cover,
        n_ratings=0,
        ave_rating=0,
        language=language,
    )

    # Add genre to the database
    for genreName in set(genres):
        if (existingGenre := Genre.query.filter_by(name=genreName).first()) :
            newBook.genres.append(existingGenre)
        else:
            newGenre = Genre(name=genreName)
            newBook.genres.append(newGenre)

    # Add author to the database
    for authorName in set(authors):
        if (existingAuthor := Author.query.filter_by(name=authorName).first()) :
            newBook.authors.append(existingAuthor)
        else:
            newAuthor = Author(name=authorName)
            newBook.authors.append(newAuthor)

    # Add to db
    db.session.add(newBook)
    db.session.commit()

    return book_schema.dump(newBook)


@app.route("/book", methods=["GET"])
def get_books():
    books = Book.query.all()
    return jsonify(books_schema.dump(books))


@app.route("/book/<isbn>")
def get_book(isbn):
    book = Book.query.filter_by(isbn=isbn).first_or_404()
    return book_schema.dump(book)


@app.route("/book/<isbn>/reviews")
def get_review(isbn):
    review = Review.query.filter_by(book_id=isbn).all()
    return jsonify(reviews_schema.dump(review))


@app.route("/book/<isbn>/addreview", methods=["POST"])
def add_review(isbn):
    review_data = request.json
    reader_id = review_data.get("reader_id")
    book_id = review_data.get("book_id")

    review = review_data.get("review")
    score = int(review_data.get("score"))

    if score > 5 or score < 1:
        raise InvalidRequest("Score should be in between 1 and 5")

    if Review.query.filter(
        (Review.reader_id == reader_id) & (Review.book_id == book_id)
    ).first():
        raise ResourceExists("User has already reviewed this book")

    new_review = Review(
        reader_id=reader_id, book_id=book_id, review=review, score=score,
    )

    db.session.add(new_review)
    db.session.commit()

    return review_schema.dump(review)


# =======================
# * USER ROUTES
# =======================


@app.route("/createaccount", methods=["POST"])
def add_reader():
    reader_data = request.json
    username = reader_data.get("username")
    email = reader_data.get("email")
    password = reader_data.get("password")

    # Ensure request is valid format
    if not (username and email and password):
        raise InvalidRequest(
            "Request should be of the form {{username: 'username', 'password', email: 'email'}}"
        )

    # Check if a user with this email/username already exists.
    if Reader.query.filter(
        (Reader.email == email) | (Reader.username == username)
    ).first():
        raise ResourceExists("The username or email already exists")

    new_reader = Reader(
        username=username,
        email=email,
        password=guard.hash_password(password),
        roles="user",
    )

    # Add the new user's Main collection
    main_collection = Collection(name="Main")
    new_reader.collections.append(main_collection)
    recently_read = Collection(name="Recently Read")
    new_reader.collections.append(recently_read)

    db.session.add(new_reader)
    db.session.commit()

    return reader_schema.dump(new_reader)


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    if not (username and password):
        raise InvalidRequest(
            "Request should be of the form {{username: 'username', password: 'password'}}",
        )

    reader = guard.authenticate(username, password)
    return jsonify({"access_token": guard.encode_jwt_token(reader)}), 200


@app.route("/user/<username>")
def get_reader(username):
    readers = Reader.query.filter_by(username=username).first_or_404()
    return jsonify(reader_schema.dump(readers))


@app.route("/user/id/<id>")
def get_reader_by_id(id):
    if not isinstance(id, int) and not id.isdigit():
        raise InvalidRequest(r"Id should be an int",)

    readers = Reader.query.filter_by(id=id).first_or_404()
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
            r"Request should be of the form {{follower: 'username', user: 'username'}}",
        )
    reader = Reader.query.filter_by(username=reader_username).first()
    follower = Reader.query.filter_by(username=follower_username).first()

    # Add the follower relationship if it does not exist
    if request.method == "POST" and follower not in reader.followers:
        reader.followers.append(follower)
        db.session.add(reader)
        db.session.commit()

    # Delete the follower relationship if it does not exist
    if request.method == "DELETE" and follower in reader.followers:
        print(f"Deleting {follower.username} from following {reader.username}")
        reader.followers.remove(follower)
        db.session.add(reader)
        db.session.commit()

    return jsonify(reader_schema.dump(follower))


@app.route("/verify")
@flask_praetorian.auth_required
def verify():
    user = flask_praetorian.current_user()
    return jsonify(reader_schema.dump(user))


# =======================
# * Collection Routes
# =======================


@app.route("/collection", methods=["POST", "DELETE"])
@flask_praetorian.auth_required
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
        # Ensure there isn't an already existing collection
        if collection:
            raise InvalidRequest(
                r"A collection with this name already exists for this user"
            )

        # Create a new collection
        new_collection = Collection(name=collection_name, reader_id=reader_id)
        db.session.add(new_collection)
        db.session.commit()

    elif request.method == "DELETE":
        # Ensure there is an already existing collection
        if not collection:
            return ResourceNotFound(
                r"A collection with this name does not exist for this user"
            )

        # Remove the collection
        db.session.delete(collection)
        db.session.commit()

    return reader_schema.dump(reader)


# Get the books in a collection
@app.route("/collection/<collectionID>")
def get_collection(collectionID):

    collection = Collection.query.filter_by(id=collectionID).first_or_404()
    return jsonify(collection_schema.dump(collection))


# TODO ensure only the user who owns the collection can modify it
@app.route("/modify_collection", methods=["POST", "DELETE"])
@flask_praetorian.auth_required
def modify_collection():
    print(request.json)
    collection_id = request.json.get("collection_id")
    book_id = request.json.get("book_id")
    if not (collection_id and book_id):
        raise InvalidRequest(
            "Request should be of the form {{'collection_id': id, 'book_id': id}}",
        )
    collection = Collection.query.filter_by(id=collection_id).first()
    book = Book.query.filter_by(isbn=book_id).first()

    # Add the chosen book to the collection, if it's not already there.
    if request.method == "POST" and book not in collection.books:
        if collection.name == "Recently Read":
            return InvalidRequest("You cannot manually add books to your recently read")
        collection.books.append(book)
        handle_recent_10(book, collection)
        db.session.add(collection)
        db.session.commit()

    # Remove the book from the collection if it is in it.
    elif request.method == "DELETE" and book in collection.books:
        collection.books.remove(book)
        db.session.add(collection)
        db.session.commit()

    return jsonify(collection_schema.dump(collection))


# =======================
# * MISC ROUTES
# =======================


@app.route("/search", methods=["POST"])
def search():
    search = request.json.get("search")
    filter = request.json.get("filter")
    print(search)
    print(filter)

    if filter == "5 Stars":
        filter = 5
    elif filter == "≥ 4 Stars":
        filter = 4
    elif filter == "≥ 3 Stars":
        filter = 3
    elif filter == "≥ 2 Stars":
        filter = 2
    elif filter == "≥ 1 Stars":
        filter = 1
    elif filter == "No Filter":
        filter = 0

    search = "%{}%".format(search)

    books = Book.query.filter(
        (Book.authors.any(Author.name.ilike(search)) | Book.title.ilike(search))
        & (Book.ave_rating >= filter)
    ).all()

    print(jsonify(books_schema.dump(books)))
    return jsonify(books_schema.dump(books))


@app.route("/usrsearch", methods=["POST"])
def usrsearch():
    search = request.json.get("search")
    print(search)

    search = "%{}%".format(search)

    users = Reader.query.filter(
        Reader.username.ilike(search) & Reader.roles.contains("user")
    ).all()

    print(jsonify(readers_schema.dump(users)))
    return jsonify(readers_schema.dump(users))


@app.route("/genre")
def get_genres():
    genres = Genre.query.all()
    return jsonify(genres_schema.dump(genres))


@app.route("/author")
def get_authors():
    authors = Author.query.all()
    return jsonify(authors_schema.dump(authors))


def handle_recent_10(book, collection):
    print("handling")
    reader = collection.reader

    recently_read = Collection.query.filter_by(
        reader_id=reader.id, name="Recently Read"
    ).first()

    if len(recently_read.books) < 10:
        recently_read.books.append(book)
        db.session.add(recently_read)
        db.session.commit()
        return

    memberships = sorted(recently_read.book_memberships, key=lambda mem: mem.date_added)
    oldest_book = memberships[0].book
    recently_read.books.remove(oldest_book)
    recently_read.books.append(book)
    db.session.add(recently_read)
    db.session.commit

