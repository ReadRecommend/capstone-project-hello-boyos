import json
import os
import uuid

import psycopg2
from dotenv import load_dotenv

load_dotenv()

from backend import db, guard
from backend.model.author import Author
from backend.model.book import Book
from backend.model.genre import Genre
from backend.model.reader import Reader
from backend.model.collection import Collection
from backend.model.collection_membership import CollectionMembership

load_dotenv()


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
            language=book_data.get("language"),
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


# Get postgres info from env, or use defaults
user = os.getenv("POSTGRES_USER") or "postgres"
password = os.getenv("POSTGRES_PASSWORD") or "test123"
host = os.getenv("POSTGRES_HOST") or "localhost"
port = os.getenv("POSTGRES_PORT") or "5432"
database = os.getenv("POSTGRES_DATABASE") or "test"

# Connect to database
conn = psycopg2.connect(
    user=user, password=password, host=host, port=port, database=database,
)

# Print state of connection after opening
print(conn)
cur = conn.cursor()

print("Deleting all existing tables")
cur.execute("DROP SCHEMA public CASCADE;")

print("Creating public schema")
cur.execute("CREATE SCHEMA public;")
conn.commit()
cur.close()
conn.close()


print("Creating tables and loading in book data")
db.create_all()
json_to_db("books.json")

print("Adding dummy non-book data")
user1 = Reader(
    username="JohnSmith",
    email="john.smith@gmail.com",
    password=guard.hash_password("hunter2"),
    roles="user",
)
user2 = Reader(
    username="JaneDoe",
    email="jane.doe@gmail.com",
    password=guard.hash_password("pass123"),
    roles="user",
)
user3 = Reader(
    username="SteveLee",
    email="steve.lee@gmail.com",
    password=guard.hash_password("stevelee123"),
    roles="user,admin",
)
user4 = Reader(
    username="SecretAdmin",
    email="secretAdmin@gmail.com",
    password=guard.hash_password("admin"),
    roles="admin",
)

user1.collections.append(
    Collection(name="Main", books=Book.query.order_by(db.func.random()).limit(5).all())
)
user2.collections.append(
    Collection(name="Main", books=Book.query.order_by(db.func.random()).limit(5).all())
)
user3.collections.append(
    Collection(name="Main", books=Book.query.order_by(db.func.random()).limit(15).all())
)
user4.collections.append(
    Collection(name="Main", books=Book.query.order_by(db.func.random()).limit(15).all())
)
user1.collections.append(Collection(name="Recently Read",))
user2.collections.append(Collection(name="Recently Read",))
user3.collections.append(Collection(name="Recently Read",))
user4.collections.append(Collection(name="Recently Read",))

user1.follows.append(user2)
user1.follows.append(user3)
user1.followers.append(user2)

classics = Genre.query.filter_by(name="Classics").first()
user1.collections.append(
    Collection(
        name="Classics",
        books=Book.query.filter(Book.genres.contains(classics)).limit(10).all(),
    )
)

scifi = Genre.query.filter_by(name="Science Fiction").first()
user2.collections.append(
    Collection(
        name="SciFi",
        books=Book.query.filter(Book.genres.contains(scifi)).limit(10).all(),
    )
)

db.session.add_all([user1, user2, user3, user4])
db.session.commit()

print("Setup complete!")
