from flask import jsonify, request

from backend.errors import ResourceNotFound
from backend.model.schema import Author, Book, Genre, Reader, books_schema
from backend.recommendation import recommendation_bp
from backend.recommendation.content_recommender import ContentRecommender
from backend.recommendation.utils import validate_integer, weighted_rating
from backend.user.utils import sort_books

# TODO make reader ID optional


@recommendation_bp.route("/author", methods=["POST"])
def get_author():

    n_recommend = validate_integer(request.json.get("nRecommend", 10), "nRecommend")

    # Seed Book
    book_id = request.json.get("bookID")
    book_id = validate_integer(book_id, "bookID")

    book = Book.query.filter_by(id=book_id).first()
    if not book:
        raise ResourceNotFound("A book with this ID does not exist")

    # Author NAME
    if request.json.get("author"):
        author_name = request.json.get("author")
        author_books = Author.query.filter_by(name=author_name).first()
        if not author_books:
            raise ResourceNotFound("An author with this name does not exist")
        author_books = author_books.books
        if book in author_books:
            author_books.remove(book)
    else:
        # If no author name provided:
        authors = book.authors
        author_books = []
        for author in authors:
            author_name = author.name
            author_book = Author.query.filter_by(name=author_name).first()
            if not author_book:
                raise ResourceNotFound("An author with this name does not exist")
            author_book = author_book.books
            author_books = author_books + author_book
        if book in author_books:
            author_books.remove(book)

    return_books = sorted(list(set(author_books)), key=weighted_rating, reverse=True)[
        :n_recommend
    ]

    if request.json.get("userID"):
        user_id = validate_integer(request.json.get("userID"), "userID")
        reader = Reader.query.filter_by(id=user_id).first()
        if not reader:
            raise ResourceNotFound("A user with the specified ID does not exist")
        user_books = sort_books(reader)
        return_books = sorted(
            list(set(return_books) - set(user_books)), key=weighted_rating, reverse=True
        )[:n_recommend]

    return jsonify(books_schema.dump(return_books))


@recommendation_bp.route("/genre", methods=["POST"])
def get_genre():

    n_recommend = validate_integer(request.json.get("nRecommend", 10), "nRecommend")

    # Seed Book
    book_id = request.json.get("bookID")
    book_id = validate_integer(book_id, "bookID")

    book = Book.query.filter_by(id=book_id).first()
    if not book:
        raise ResourceNotFound("A book with this ID does not exist")

    # Genre NAME
    if request.json.get("genre"):
        genre = request.json.get("genre")
        genre_books = Genre.query.filter_by(name=genre).first()
        if not genre_books:
            raise ResourceNotFound("A genre with this name does not exist")

        genre_books = genre_books.books
        if book in genre_books:
            genre_books.remove(book)
    else:
        # If genre name provided:
        genres = book.genres
        genre_books = []

        for genre in genres:
            genre = genre.name
            genre_book = Genre.query.filter_by(name=genre).first()
            if not genre_book:
                raise ResourceNotFound("A genre with this name does not exist")
            genre_book = genre_book.books
            genre_books = genre_book + genre_book

        if book in genre_books:
            genre_books.remove(book)

    return_books = sorted(list(set(genre_books)), key=weighted_rating, reverse=True)[
        :n_recommend
    ]

    if request.json.get("userID"):
        user_id = validate_integer(request.json.get("userID"), "userID")
        reader = Reader.query.filter_by(id=user_id).first()
        if not reader:
            raise ResourceNotFound("A user with the specified ID does not exist")
        user_books = sort_books(reader)
        return_books = sorted(
            list(set(return_books) - set(user_books)), key=weighted_rating, reverse=True
        )[:n_recommend]

    return jsonify(books_schema.dump(return_books))


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
        list(set(following_books) - set(user_books)), key=weighted_rating, reverse=True,
    )[:n_recommend]

    return jsonify(books_schema.dump(unread_books))


@recommendation_bp.route("/content", methods=["POST"])
def get_content():
    book_id = request.json.get("bookID")

    book_id = validate_integer(book_id, "bookID")

    book = Book.query.filter_by(id=book_id).first()
    if not book:
        raise ResourceNotFound("A book with this ID does not exist")

    n_recommend = validate_integer(request.json.get("nRecommend", 10), "nRecommend")

    recommender = ContentRecommender(ngram_range=(1, 1))
    recommendations = recommender.recommend(book, n_recommend=n_recommend)

    if request.json.get("userID"):
        user_id = validate_integer(request.json.get("userID"), "userID")
        reader = Reader.query.filter_by(id=user_id).first()
        if not reader:
            raise ResourceNotFound("A user with the specified ID does not exist")
        reader_books = sort_books(reader)
        recommendations = list(set(recommendations) - set(reader_books))

    return jsonify(books_schema.dump(recommendations))


@recommendation_bp.route("/top_rated", methods=["POST"])
def get_top():
    n_recommend = validate_integer(request.json.get("nRecommend", 10), "nRecommend")
    books = Book.query.filter(Book.ave_rating > 3).all()
    books = sorted(books, key=weighted_rating, reverse=True)[:n_recommend]
    return jsonify(books_schema.dump(books))
