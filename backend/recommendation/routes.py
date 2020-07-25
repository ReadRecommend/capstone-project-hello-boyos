from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.recommendation import recommendation_bp
from backend.errors import InvalidRequest, ResourceExists, ResourceNotFound
from backend.model.schema import (
    Book,
    book_schema,
    books_schema,
    Genre,
    genre_schema,
    genres_schema,
    Author,
    author_schema,
    authors_schema,
    Review,
    Reader,
    reader_schema,
    readers_schema,
    Collection,
    collection_schema,
    collections_schema,
)


@recommendation_bp.route("/author", methods=["POST"])
def get_author():

    userID = request.json.get("userID")
    # Author NAME
    authorName = request.json.get("author")

    authorBooks = Author.query.filter_by(name=authorName).first().books
    userBooks = Collection.query.filter_by(reader_id=userID, name="Main").first().books

    unreadBooks = list(set(authorBooks) - set(userBooks))

    return jsonify(books_schema.dump(unreadBooks))


@recommendation_bp.route("/genre", methods=["GET"])
def get_genre():

    userID = request.json.get("userID")
    # Genre NAME
    genre = request.json.get("genre")

    genreBooks = Genre.query.filter_by(name=genre).first().books
    userBooks = Collection.query.filter_by(reader_id=userID, name="Main").first().books

    unreadBooks = list(set(genreBooks) - set(userBooks))

    return jsonify(books_schema.dump(unreadBooks))


@recommendation_bp.route("/following", methods=["POST"])
def get_following():

    userID = request.json.get("userID")

    reader = Reader.query.filter_by(id=userID).first().follows

    followingBooks = []

    for item in reader:
        for collection in item.collections:
            if collection.name == "Main":
                followingBooks = followingBooks + collection.books

    followingBooks = list(dict.fromkeys(followingBooks))
    userBooks = Collection.query.filter_by(reader_id=userID, name="Main").first().books

    unreadBooks = list(set(followingBooks) - set(userBooks))

    return jsonify(books_schema.dump(unreadBooks))
