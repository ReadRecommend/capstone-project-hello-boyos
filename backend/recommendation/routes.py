from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.recommendation import recommendation_bp
from backend.errors import InvalidRequest, ResourceExists, ResourceNotFound
from backend.model.schema import (
    Book,
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
)


@recommendation_bp.route("/author/<name>", methods=["GET"])
def get_author(name):
    author = Author.query.filter_by(name=name).first()
    return jsonify(author_schema.dump(author))


@recommendation_bp.route("/genre/<genre>", methods=["GET"])
def get_genre(genre):
    genre = Genre.query.filter_by(name=genre).all()
    return jsonify(genres_schema.dump(genre))


@recommendation_bp.route("/following/<username>", methods=["GET"])
def get_following(username):
    reader = Reader.query.filter_by(username=username).first()
    followings = reader.follows
    print()
    return jsonify(readers_schema.dump(followings))
