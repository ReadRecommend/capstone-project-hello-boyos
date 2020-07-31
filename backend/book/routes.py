import math

from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.book import book_bp
from backend.book.utils import validate_book_data
from backend.errors import InvalidRequest, ResourceExists, ResourceNotFound
from backend.model.schema import (
    Author,
    Book,
    CollectionMembership,
    Genre,
    Review,
    book_schema,
    books_schema,
    review_schema,
    reviews_schema,
)
from backend.utils import extract_integer, extract_integers


@book_bp.route("", methods=["POST"])
@flask_praetorian.roles_required("admin")
def add_book():
    raw_book_data = request.json
    book_data = validate_book_data(raw_book_data)

    # Create new book
    new_book = Book(
        isbn=book_data.get("isbn"),
        title=book_data.get("title"),
        publisher=book_data.get("publisher"),
        publication_date=book_data.get("publication_date"),
        summary=book_data.get("summary"),
        cover=book_data.get("cover"),
        language=book_data.get("language"),
    )

    # Add genre to the database if it does not already exist
    for genre_name in set(book_data.get("genres", [])):
        if existing_genre := Genre.query.filter_by(name=genre_name).first():
            new_book.genres.append(existing_genre)
        else:
            new_genre = Genre(name=genre_name)
            new_book.genres.append(new_genre)

    # Add author to the database if it does not already exist
    for author_name in set(book_data.get("authors", [])):
        if existing_author := Author.query.filter_by(name=author_name).first():
            new_book.authors.append(existing_author)
        else:
            new_author = Author(name=author_name)
            new_book.authors.append(new_author)

    # Commit changes to db
    db.session.add(new_book)
    db.session.commit()

    return jsonify(book_schema.dump(new_book))


@book_bp.route("", methods=["DELETE"])
@flask_praetorian.roles_required("admin")
def delete_book():
    book_id = extract_integer(request.json, "id")

    book = Book.query.filter_by(id=book_id).first()

    # Check book exists
    if not (book):
        raise ResourceNotFound("Book does not exist")

    # Delete the book from all the collections it is in
    CollectionMembership.query.filter_by(book_id=book.id).delete()

    # Delete the book
    db.session.delete(book)
    db.session.commit()

    # Return the new state of all books in the db
    books = Book.query.all()
    return jsonify(books_schema.dump(books))


@book_bp.route("", methods=["GET"])
def get_books():
    books = Book.query.all()
    return jsonify(books_schema.dump(books))


@book_bp.route("/<id_>")
def get_book(id_):
    if not id_.isdigit():
        raise InvalidRequest("A book's ID should be a positive integer")
    book = Book.query.filter_by(id=id_).first()
    if not book:
        raise ResourceNotFound("A book with this id does not exist")
    return jsonify(book_schema.dump(book))


@book_bp.route("/<id_>/reviews", methods=["POST"])
def get_review(id_):
    if not id_.isdigit():
        raise InvalidRequest("A book's ID should be a positive integer")

    request_data = request.json

    # page = request_data.get("page")
    page, n_reviews = extract_integers(request_data, ["page", "reviews_per_page"])

    review = Review.query.filter_by(book_id=id_).paginate(page, n_reviews, True)
    return jsonify(reviews_schema.dump(review.items))


@book_bp.route("/<id_>/reviewpage", methods=["POST"])
def get_review_count(id_):
    if not id_.isdigit():
        raise InvalidRequest("A book's ID should be a positive integer")

    request_data = request.json

    n_reviews = extract_integer(request_data, "reviews_per_page")

    review = Review.query.filter_by(book_id=id_).count()

    pages = math.ceil(review / n_reviews)
    return {"count": pages}


@book_bp.route("/review", methods=["POST"])
@flask_praetorian.roles_required("user")
def add_review():
    review_data = request.json
    reader_id, book_id = extract_integers(review_data, ["reader_id", "book_id"])

    review = review_data.get("review")
    score = extract_integer(review_data, "score")
    if Review.query.filter(
        (Review.reader_id == reader_id) & (Review.book_id == book_id)
    ).first():
        raise ResourceExists("You have already reviewed this book")

    new_review = Review(
        reader_id=reader_id, book_id=book_id, review=review, score=score,
    )

    book = Book.query.filter_by(id=book_id).first()

    book.n_ratings += 1
    book.ave_rating = ((score - book.ave_rating) / (book.n_ratings)) + book.ave_rating

    db.session.add(new_review)
    db.session.commit()

    return jsonify(review_schema.dump(review))
