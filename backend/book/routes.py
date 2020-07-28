from flask import jsonify, request
import flask_sqlalchemy
import math


import flask_praetorian
from backend import db
from backend.book import book_bp
from backend.errors import InvalidRequest, ResourceExists, ResourceNotFound
from backend.model.schema import (
    Book,
    book_schema,
    books_schema,
    Genre,
    Author,
    Review,
    CollectionMembership,
    review_schema,
    reviews_schema,
)


@book_bp.route("", methods=["POST"])
@flask_praetorian.roles_required("admin")
def add_book():
    book_data = request.json
    isbn = book_data.get("isbn")
    title = book_data.get("title")
    authors = book_data.get("authors")
    genres = book_data.get("genres")
    publisher = book_data.get("publisher")
    publicationDate = book_data.get("publicationDate")
    summary = book_data.get("summary")
    cover = book_data.get("cover")
    language = book_data.get("language")

    # Ensure request is valid format
    if not (title and isbn and authors):
        raise InvalidRequest(
            "Request should be of the form {{isbn: 'isbn', title: 'title', authors: [authors]}}"
        )

    # Check if a Book with this isbn already exists
    if Book.query.filter((Book.isbn == isbn)).first():
        raise ResourceExists("A book with this isbn already exists")

    # TODO Check if a book with this title/author combo exists

    # Create new book
    new_book = Book(
        isbn=isbn,
        title=title,
        publisher=publisher,
        publication_date=publicationDate,
        summary=summary,
        cover=cover,
        n_ratings=0,
        ave_rating=0,
        language=language,
    )

    # Add genre to the database if it does not already exist
    for genre_name in set(genres):
        if (existing_genre := Genre.query.filter_by(name=genre_name).first()) :
            new_book.genres.append(existing_genre)
        else:
            new_genre = Genre(name=genre_name)
            new_book.genres.append(new_genre)

    # Add author to the database if it does not already exist
    for author_name in set(authors):
        if (existing_author := Author.query.filter_by(name=author_name).first()) :
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
    book_id = request.json.get("id")

    # Ensure proper fields exist
    if not (book_id):
        raise InvalidRequest("Request should be of the form {{book_id: 'book_id'}}")

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


@book_bp.route("/<id>")
def get_book(id):
    book = Book.query.filter_by(id=id).first()
    if not book:
        raise ResourceNotFound("A book with this id does not exist")
    return jsonify(book_schema.dump(book))


@book_bp.route("/<id>/reviews", methods=["POST"])
def get_review(id):
    request_data = request.json

    page = request_data.get("page")
    nReview = request_data.get("reviews_per_page")

    review = Review.query.filter_by(book_id=id).paginate(page, nReview, True)
    return jsonify(reviews_schema.dump(review.items))


@book_bp.route("/<id>/reviewpage", methods=["POST"])
def get_review_count(id):
    request_data = request.json

    nReview = request_data.get("reviews_per_page")

    review = Review.query.filter_by(book_id=id).count()

    pages = math.ceil(review / nReview)
    return {"count": pages}


@book_bp.route("/review", methods=["POST"])
def add_review():
    review_data = request.json
    reader_id = review_data.get("reader_id")
    book_id = review_data.get("book_id")

    review = review_data.get("review")
    score = review_data.get("score")
    if Review.query.filter(
        (Review.reader_id == reader_id) & (Review.book_id == book_id)
    ).first():
        raise ResourceExists("You have already reviewed this book")

    new_review = Review(
        reader_id=reader_id, book_id=book_id, review=review, score=score,
    )

    book = Book.query.filter_by(id=book_id).first()

    book.n_ratings += 1
    book.ave_rating = (
        (int(score) - book.ave_rating) / (book.n_ratings)
    ) + book.ave_rating

    db.session.add(new_review)
    db.session.commit()

    return jsonify(review_schema.dump(review))
