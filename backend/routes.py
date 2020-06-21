from flask import abort, jsonify, request
from werkzeug.security import generate_password_hash

from backend import app, db, ma
from backend.model.schema import *


@app.route("/")
def home():
    return "Hello"


@app.route("/book")
def get_books():
    books = Book.query.all()
    return jsonify(books_schema.dump(books))


@app.route("/book/<isbn>")
def get_book(isbn):
    book = Book.query.filter_by(isbn=isbn).first()
    return book_schema.dump(book)


@app.route("/book", methods=["POST"])
def add_book():
    book_data = request.json.get("book")
    try:
        book = Book(**book_data)

        if (genres := request.json.get("genres", None)) :
            for genre_data in genres:
                if (
                    existing_genre := Genre.query.filter_by(
                        name=genre_data.get("name")
                    ).first()
                ) :
                    book.genres.append(existing_genre)
                else:
                    new_genre = Genre(**genre_data)
                    book.genres.append(new_genre)

        if (authors := request.json.get("authors", None)) :
            for author_data in authors:
                if (
                    existing_author := Author.query.filter_by(
                        name=author_data.get("name")
                    ).first()
                ) :
                    book.authors.append(existing_author)
                else:
                    new_author = Author(**author_data)
                    book.authors.append(new_author)

        db.session.add(book)
        db.session.commit()
        return book_schema.dump(book)
    except Exception as e:
        return abort(400, e)


@app.route("/user", methods=["POST"])
def add_user():
    user_data = request.json
    if User.query.filter(
        (User.email == user_data.get("email"))
        | (User.username == user_data.get("username"))
    ).first():
        return abort(403, "The username or email already exists")

    new_user = User(
        username=user_data["username"],
        email=user_data["email"],
        password=generate_password_hash(user_data["password"]),
    )

    main_collection = Collection(name="main")
    new_user.collections.append(main_collection)
    db.session.add(new_user)
    db.session.commit()
    return user_schema.dump(new_user)


@app.route("/user/<username>")
def get_user(username):
    users = User.query.filter_by(username=username).first()
    return jsonify(user_schema.dump(users))


@app.route("/user")
def get_users():
    users = User.query.all()
    return jsonify(users_schema.dump(users))


@app.route("/genre")
def get_genres():
    genres = Genre.query.all()
    return jsonify(genres_schema.dump(genres))


@app.route("/author")
def get_authors():
    authors = Author.query.all()
    return jsonify(authors_schema.dump(authors))
