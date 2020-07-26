from flask import jsonify, request

from backend.errors import InvalidRequest, ResourceNotFound
from backend.model.schema import Author, Book, Collection, Genre, Reader, books_schema
from backend.recommendation import recommendation_bp
from backend.recommendation.content_recommender import ContentRecommender


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


@recommendation_bp.route("/content", methods=["POST"])
def get_content():
    book_id = request.json.get("bookID")
    if not book_id or not book_id.isdigit():
        raise InvalidRequest(
            "Request should be of the form {{bookID: 'bookID'}} where bookID is parseable as an integer"
        )
    book = Book.query.filter_by(id=book_id).first()
    if not book:
        raise ResourceNotFound("A book with this ID does not exist")

    recommender = ContentRecommender()
    recommendations = recommender.recommend(book, n_recommend=10)
    return jsonify(books_schema.dump(recommendations))
