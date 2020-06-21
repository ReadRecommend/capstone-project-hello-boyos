import json
import uuid
from backend.model.author import Author
from backend.model.book import Book
from backend.model.genre import Genre
from backend import db


def json_to_db(path):
    """Read all books in JSON file and commit to flask-sqlalchemy db

    Args:
        path (str): The absolute path to the books JSON file
    """
    f = open(path, "r")
    namespace = uuid.uuid4()

    data = json.load(f)

    for book_data in data:
        book = Book(
            isbn=book_data.get("isbn")
            # If no isbn, assign a uuid
            or uuid.uuid5(namespace, book_data.get("title")).hex,
            title=book_data.get("title"),
            publisher=book_data.get("publisher"),
            publication_date=book_data.get("publication_year"),
            summary=book_data.get("description"),
            cover=book_data.get("image_url"),
            n_ratings=book_data.get("n_reviews"),
            ave_rating=book_data.get("rating"),
        )

        for genre_name in set(book_data.get("genres", [])):
            if (existing_genre := Genre.query.filter_by(name=genre_name).first()) :
                book.genres.append(existing_genre)
            else:
                new_genre = Genre(name=genre_name)
                book.genres.append(new_genre)

        for author_name in set(book_data.get("authors", [])):
            if (existing_author := Author.query.filter_by(name=author_name).first()) :
                book.authors.append(existing_author)
            else:
                new_author = Author(name=author_name)
                book.authors.append(new_author)

        db.session.add(book)
        db.session.commit()
    f.close()
