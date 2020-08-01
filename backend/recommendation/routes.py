from flask import jsonify, request

from backend.errors import InvalidRequest, ResourceNotFound
from backend.model.schema import Author, Book, Genre, Reader, books_schema
from backend.recommendation import (
    DEFAULT_NRECOMMEND,
    POOL_SIZE,
    recommendation_bp,
)
from backend.recommendation.content_recommender import ContentRecommender
from backend.recommendation.utils import (
    remove_reader_overlap,
    sample_top_books,
)
from backend.user.utils import get_all_books
from backend.utils import extract_integer


@recommendation_bp.route("/author", methods=["POST"])
def get_author():
    request_data = request.json
    n_recommend = extract_integer(
        request_data, "n_recommend", default_value=DEFAULT_NRECOMMEND
    )

    # Seed Book
    book_id = extract_integer(request_data, "bookID")
    seed_book = Book.query.filter_by(id=book_id).first()
    if not seed_book:
        raise ResourceNotFound("A book with this ID does not exist")

    # If an author's name is provided, use their books
    if author_name := request_data.get("author"):
        author = Author.query.filter_by(name=author_name).first()
        if not author:
            raise ResourceNotFound("An author with this name does not exist")
        all_author_books = author.books

    # If no author name provided, use books from all authors of the seed book
    else:
        authors = seed_book.authors
        all_author_books = set()
        for author in authors:
            author_books = author.books
            all_author_books.update(set(author_books))

    all_author_books = list(all_author_books)

    # Remove seed book if present
    all_author_books = [book for book in all_author_books if book is not seed_book]

    # If a user id is provided, remove overlap between a user's books and the authors books
    if user_id := extract_integer(request_data, "userID", required=False):
        all_author_books = remove_reader_overlap(user_id, all_author_books)

    recommendations = sample_top_books(all_author_books, n_recommend)
    return jsonify(books_schema.dump(recommendations))


@recommendation_bp.route("/genre", methods=["POST"])
def get_genre():
    request_data = request.json
    n_recommend = extract_integer(
        request_data, "n_recommend", default_value=DEFAULT_NRECOMMEND
    )

    # Seed Book
    book_id = extract_integer(request_data, "bookID")
    seed_book = Book.query.filter_by(id=book_id).first()
    if not seed_book:
        raise ResourceNotFound("A book with this ID does not exist")

    # If a genre name is provided, use books from that genre
    if genre_name := request.json.get("genre"):
        genre = Genre.query.filter_by(name=genre_name).first()
        if not genre:
            raise ResourceNotFound("A genre with this name does not exist")
        all_genre_books = genre.books

    # If no genre name provided, use books from all genres of the seed book
    else:
        genres = seed_book.genres
        all_genre_books = set()
        for genre in genres:
            genre_books = genre.books
            all_genre_books.update(set(genre_books))

    all_genre_books = list(all_genre_books)

    # Remove seed book if present
    all_genre_books = [book for book in all_genre_books if book is not seed_book]

    # If a user id is provided, remove overlap between a user's books and the genre books
    if user_id := extract_integer(request_data, "userID", required=False):
        all_genre_books = remove_reader_overlap(user_id, all_genre_books)

    recommendations = sample_top_books(all_genre_books, n_recommend)
    return jsonify(books_schema.dump(recommendations))


@recommendation_bp.route("/following", methods=["POST"])
def get_following():
    request_data = request.json
    user_id = extract_integer(request_data, "userID")
    reader = Reader.query.filter_by(id=user_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    follows = reader.follows
    if not follows:
        raise ResourceNotFound(
            "The user with the specified ID does not follow any users"
        )

    n_recommend = extract_integer(
        request_data, "n_recommend", default_value=DEFAULT_NRECOMMEND
    )

    all_following_books = set()
    for followed_user in follows:
        all_following_books.update(set(get_all_books(followed_user)))

    all_following_books = list(all_following_books)

    all_following_books = remove_reader_overlap(reader.id, all_following_books)
    recommendations = sample_top_books(all_following_books, n_recommend)

    return jsonify(books_schema.dump(recommendations))


@recommendation_bp.route("/content", methods=["POST"])
def get_content():
    request_data = request.json
    n_recommend = extract_integer(
        request_data, "n_recommend", default_value=DEFAULT_NRECOMMEND
    )

    recommender = ContentRecommender(ngram_range=(1, 1))

    # Get recommendations from single book or list of books
    book_id = extract_integer(request_data, "bookID", required=False)
    book_ids = request_data.get("bookIDs")

    # Recommending from single seed book ID
    if book_id:
        seed = Book.query.filter_by(id=book_id).first()
        if not seed:
            raise ResourceNotFound("A book with this ID does not exist")

    # Recommending from list of book IDs
    elif book_ids:
        seed = Book.query.filter(Book.id.in_(book_ids)).all()
        if not len(seed) == len(book_ids):
            raise ResourceNotFound(
                "One of more books with a provided bookID does not exist"
            )
    else:
        raise InvalidRequest("One of 'bookID' or 'bookIDs' is a required key")

    try:
        most_similar_books = recommender.recommend(
            seed, n_recommend=POOL_SIZE * n_recommend
        )
    except ValueError:
        raise InvalidRequest("The provided bookID(s) did not correspond to books")

    # If a user id is provided, remove overlap between a user's books and the genre books
    if user_id := extract_integer(request_data, "userID", required=False):
        most_similar_books = remove_reader_overlap(user_id, most_similar_books)

    recommendations = sample_top_books(most_similar_books)

    return jsonify(books_schema.dump(recommendations))


@recommendation_bp.route("/top_rated", methods=["POST"])
def get_top():
    request_data = request.json
    n_recommend = extract_integer(
        request_data, "n_recommend", default_value=DEFAULT_NRECOMMEND
    )

    top_rated_books = Book.query.filter(Book.ave_rating > 4).all()

    # If a user id is provided, remove overlap between a user's books and the genre books
    if user_id := extract_integer(request_data, "userID", required=False):
        top_rated_books = remove_reader_overlap(user_id, top_rated_books)

    recommendations = sample_top_books(top_rated_books, n_recommend)
    return jsonify(books_schema.dump(recommendations))
