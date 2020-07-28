from flask import jsonify, request

from backend.errors import InvalidRequest, ResourceNotFound
from backend.model.schema import Author, Book, Genre, Reader, books_schema
from backend.recommendation import recommendation_bp
from backend.recommendation.content_recommender import ContentRecommender
from backend.recommendation.utils import validate_integer
from backend.user.utils import sort_books


@recommendation_bp.route("/author", methods=["POST"])
def get_author():

    user_id = validate_integer(request.json.get("userID"), "userID")

    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    n_recommend = validate_integer(request.json.get("nRecommend", 10), "nRecommend")

    user_books = sort_books(reader)

    # Author NAME
    author_name = request.json.get("author")
    author_books = Author.query.filter_by(name=author_name).first()

    if not author_books:
        raise ResourceNotFound("An author with this name does not exist")
    author_books = author_books.books

    unread_books = sorted(
        list(set(author_books) - set(user_books)), key=lambda book: book.ave_rating
    )[:n_recommend]

    return jsonify(books_schema.dump(unread_books))


@recommendation_bp.route("/genre", methods=["POST"])
def get_genre():

    user_id = validate_integer(request.json.get("userID"), "userID")

    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    n_recommend = validate_integer(request.json.get("nRecommend", 10), "nRecommend")

    user_books = sort_books(reader)

    # Genre NAME
    genre = request.json.get("genre")
    genre_books = Genre.query.filter_by(name=genre).first()
    if not genre_books:
        raise ResourceNotFound("A genre with this name does not exist")
    genre_books = genre_books.books

    unread_books = sorted(
        list(set(genre_books) - set(user_books)), key=lambda book: book.ave_rating
    )[:n_recommend]

    return jsonify(books_schema.dump(unread_books))


@recommendation_bp.route("/following", methods=["POST"])
def get_following():
    user_id = validate_integer(request.json.get("userID"), "userID")

    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    user_books = sort_books(reader)

    follows = Reader.query.filter_by(id=user_id).first().follows
    if not follows:
        raise ResourceNotFound(
            "The user with the specified ID does not follow any users"
        )

    n_recommend = validate_integer(request.json.get("nRecommend", 10), "nRecommend")

    following_books = []

    for following in follows:
        following_books = following_books + sort_books(following)

    following_books = list(dict.fromkeys(following_books))

    unread_books = sorted(
        list(set(following_books) - set(user_books)), key=lambda book: book.ave_rating
    )[:n_recommend]

    return jsonify(books_schema.dump(unread_books))


@recommendation_bp.route("/content", methods=["POST"])
def get_content():
    book_id = request.json.get("bookID")
    user_id = request.json.get("userID")

    book_id = validate_integer(book_id, "bookID")

    book = Book.query.filter_by(id=book_id).first()
    if not book:
        raise ResourceNotFound("A book with this ID does not exist")

    n_recommend = validate_integer(request.json.get("nRecommend", 10), "nRecommend")

    recommender = ContentRecommender(ngram_range=(1, 1))
    recommendations = recommender.recommend(book, n_recommend=n_recommend)

    user_id = validate_integer(user_id, "userID")

    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    reader_books = sort_books(reader)
    unread_recommendations = list(set(recommendations) - set(reader_books))

    return jsonify(books_schema.dump(unread_recommendations))
