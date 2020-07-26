from flask import jsonify, request

from backend.errors import InvalidRequest, ResourceNotFound
from backend.user.utils import sort_books
from backend.model.schema import Author, Book, Collection, Genre, Reader, books_schema
from backend.recommendation import recommendation_bp
from backend.recommendation.content_recommender import ContentRecommender


@recommendation_bp.route("/author", methods=["POST"])
def get_author():

    user_id = request.json.get("userID")
    if not user_id.isdigit():
        raise InvalidRequest("the userID must be parseable as an integer")

    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    userBooks = sort_books(reader)

    # Author NAME
    authorName = request.json.get("author")
    authorBooks = Author.query.filter_by(name=authorName).first()

    if not authorBooks:
        raise ResourceNotFound("An author with this name does not exist")
    authorBooks = authorBooks.books

    unreadBooks = list(set(authorBooks) - set(userBooks))

    return jsonify(books_schema.dump(unreadBooks))


@recommendation_bp.route("/genre", methods=["POST"])
def get_genre():

    user_id = request.json.get("userID")

    if not user_id.isdigit():
        raise InvalidRequest("the userID must be parseable as an integer")

    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    userBooks = sort_books(reader)

    # Genre NAME
    genre = request.json.get("genre")
    genreBooks = Genre.query.filter_by(name=genre).first()
    if not genreBooks:
        raise ResourceNotFound("A genre with this name does not exist")
    genreBooks = genreBooks.books

    unreadBooks = list(set(genreBooks) - set(userBooks))

    return jsonify(books_schema.dump(unreadBooks))


@recommendation_bp.route("/following", methods=["POST"])
def get_following():

    user_id = request.json.get("userID")

    if not user_id.isdigit():
        raise InvalidRequest("the userID must be parseable as an integer")

    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    userBooks = sort_books(reader)

    reader = Reader.query.filter_by(id=user_id).first().follows
    if not reader:
        raise ResourceNotFound(
            "The user with the specified ID does not follow any users"
        )

    followingBooks = []

    for following in reader:
        followingBooks = followingBooks + sort_books(following)

    followingBooks = list(dict.fromkeys(followingBooks))

    unreadBooks = list(set(followingBooks) - set(userBooks))

    return jsonify(books_schema.dump(unreadBooks))


@recommendation_bp.route("/content", methods=["POST"])
def get_content():
    book_id = request.json.get("bookID")
    user_id = request.json.get("userID")
    if not book_id or not book_id.isdigit():
        raise InvalidRequest(
            "Request should be of the form {{bookID: 'bookID'}} where bookID is parseable as an integer"
        )
    book = Book.query.filter_by(id=book_id).first()
    if not book:
        raise ResourceNotFound("A book with this ID does not exist")

    recommender = ContentRecommender()
    recommendations = recommender.recommend(book, n_recommend=10)

    if not user_id.isdigit():
        raise InvalidRequest("the userID must be parseable as an integer")
    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    reader_books = sort_books(reader)
    unread_recommendations = list(set(recommendations) - set(reader_books))

    return jsonify(books_schema.dump(unread_recommendations))
