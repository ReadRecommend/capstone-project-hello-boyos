from flask import jsonify
from flask_cors import cross_origin

from backend import app
from backend.model.schema import Genre, genres_schema, Author, authors_schema


@app.route("/")
@cross_origin()
def home():
    return "ReadRecommend"


@app.route("/genre")
def get_genres():
    genres = Genre.query.all()
    return jsonify(genres_schema.dump(genres))


@app.route("/author")
def get_authors():
    authors = Author.query.all()
    return jsonify(authors_schema.dump(authors))
