from flask import jsonify, request

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
    review_schema,
    reviews_schema,
)


@book_bp.route("", methods=["POST"])
@flask_praetorian.roles_required("admin")
def add_book():
    bookData = request.json
    isbn = bookData.get("isbn")
    title = bookData.get("title")
    authors = bookData.get("authors")
    genres = bookData.get("genres")
    publisher = bookData.get("publisher")
    publicationDate = bookData.get("publicationDate")
    summary = bookData.get("summary")
    cover = bookData.get("cover")
    language = bookData.get("language")

    # Ensure request is valid format
    if not (title and isbn):
        raise InvalidRequest(
            "Request should be of the form {{isbn: 'isbn', title: 'title'}}"
        )

    # Check if a Book with this title/isbn already exists
    if Book.query.filter((Book.isbn == isbn) | (Book.title == title)).first():
        raise ResourceExists("A book with this title/isbn already exists")

    # Create new book
    new_book = Book(
        isbn=isbn,
        title=bookData.get("title"),
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
        if (existingGenre := Genre.query.filter_by(name=genre_name).first()) :
            new_book.genres.append(existingGenre)
        else:
            newGenre = Genre(name=genre_name)
            new_book.genres.append(newGenre)

    # Add author to the database
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


@book_bp.route("/<id>/reviews")
def get_review(id):
    review = Review.query.filter_by(book_id=id).all()
    return jsonify(reviews_schema.dump(review))


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
        raise ResourceExists("User has already reviewed this book")

    new_review = Review(
        reader_id=reader_id, book_id=book_id, review=review, score=score,
    )

    db.session.add(new_review)
    db.session.commit()

    return jsonify(review_schema.dump(review))
