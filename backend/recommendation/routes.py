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


@recommendation_bp.route("/author/<name>", methods=["GET"])
def get_author(name):
    # Placeholder userID
    userID = 1

    authorBooks = Author.query.filter_by(name=name).first().books
    userBooks = Collection.query.filter_by(reader_id=userID, name="Main").first().books

    unreadBooks = list(set(authorBooks) - set(userBooks))

    return jsonify(books_schema.dump(unreadBooks))


@recommendation_bp.route("/genre/<genre>", methods=["GET"])
def get_genre(genre):
    # Placeholder userID
    userID = 1

    genreBooks = Genre.query.filter_by(name=genre).first().books
    userBooks = Collection.query.filter_by(reader_id=userID, name="Main").first().books

    unreadBooks = list(set(genreBooks) - set(userBooks))

    return jsonify(books_schema.dump(unreadBooks))


@recommendation_bp.route("/following/<username>", methods=["GET"])
def get_following(username):
    # Replace
    reader = Reader.query.filter_by(username=username).first().follows

    return jsonify(readers_schema.dump(reader))
