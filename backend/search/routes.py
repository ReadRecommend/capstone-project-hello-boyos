from flask import jsonify, request

from backend.search import search_bp
from backend.model.schema import (
    Book,
    books_schema,
    Author,
    Reader,
    readers_schema,
)


@search_bp.route("", methods=["POST"])
def search():
    search_term = request.json.get("search")
    rating_filter = request.json.get("filter")

    if rating_filter == "No Filter":
        rating_filter = 0
    elif rating_filter == "≥ 4 Stars":
        rating_filter = 4
    elif rating_filter == "≥ 3 Stars":
        rating_filter = 3
    elif rating_filter == "≥ 2 Stars":
        rating_filter = 2
    elif rating_filter == "≥ 1 Stars":
        rating_filter = 1

    search_term = f"%{search_term}%"

    books = Book.query.filter(
        (
            Book.authors.any(Author.name.ilike(search_term))
            | Book.title.ilike(search_term)
        )
        & (Book.ave_rating >= rating_filter)
    ).all()

    return jsonify(books_schema.dump(books))


@search_bp.route("/users", methods=["POST"])
def usersearch():
    search_term = request.json.get("search")
    print(search_term)

    search_term = f"%{search_term}%"

    users = Reader.query.filter(
        Reader.username.ilike(search_term) & Reader.roles.contains("user")
    ).all()

    return jsonify(readers_schema.dump(users))
