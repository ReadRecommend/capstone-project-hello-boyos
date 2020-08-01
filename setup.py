import json
import os
from getpass import getpass
import readline

import psycopg2
from colorama import Fore, init
from dotenv import load_dotenv

load_dotenv(override=True)

from backend import db, guard
from backend.model.author import Author
from backend.model.book import Book
from backend.model.collection import Collection
from backend.model.genre import Genre
from backend.model.reader import Reader
from backend.recommendation.content_recommender import ContentRecommender

init(autoreset=True)


def json_to_db(path):
    """Read all books in JSON file and commit to flask-sqlalchemy db
    Args:
        path (str): The absolute path to the books JSON file
    """
    try:
        f = open(path, "r")
        data = json.load(f)
    except FileNotFoundError:
        return
    for book_data in data:
        book = Book(
            isbn=book_data.get("isbn"),
            title=book_data.get("title"),
            publisher=book_data.get("publisher"),
            publication_date=book_data.get("publication_year"),
            summary=book_data.get("description"),
            cover=book_data.get(
                "image_url",
                "https://www.kindpng.com/picc/m/84-843028_book-clipart-square-blank-book-cover-clip-art.png",
            ),
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
            if "(" in author_name or ")" in author_name:
                continue
            if (existing_author := Author.query.filter_by(name=author_name).first()) :
                book.authors.append(existing_author)
            else:
                new_author = Author(name=author_name)
                book.authors.append(new_author)

        db.session.add(book)
        db.session.commit()
    f.close()


# Get postgres info from env, or use defaults
user = os.getenv("POSTGRES_USER", "postgres")
password = os.getenv("POSTGRES_PASSWORD", "test123")
host = os.getenv("POSTGRES_HOST", "localhost")
port = int(os.getenv("POSTGRES_PORT", "5432"))
database = os.getenv("POSTGRES_DATABASE", "test")

# Connect to database
conn = psycopg2.connect(
    user=user, password=password, host=host, port=port, database=database,
)

cur = conn.cursor()

print("Deleting all existing tables")
cur.execute("DROP SCHEMA public CASCADE;")

print("Creating public schema")
cur.execute("CREATE SCHEMA public;")
conn.commit()
cur.close()
conn.close()


print("Creating tables and loading in book data (may take some time)...")
db.create_all()
initial_data = os.getenv("INITIAL_DATA", "books.json")
json_to_db(initial_data)

dummy_users = input("Would you like to create 2 dummy users? [y/n]\n")
if "y" in dummy_users:
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

    user1.follows.append(user2)
    user1.followers.append(user2)

    # Only add collections if there are books
    if Book.query.first():
        user1.collections.append(
            Collection(
                name="Main", books=Book.query.order_by(db.func.random()).limit(5).all()
            )
        )
        user2.collections.append(
            Collection(
                name="Main", books=Book.query.order_by(db.func.random()).limit(5).all()
            )
        )

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
    else:
        user1.collections.append(Collection(name="Main"))
        user2.collections.append(Collection(name="Main"))

    print(Fore.CYAN + "=========================================")
    print(
        Fore.CYAN
        + "Dummy user info:\nusername: JohnSmith \tpassword: hunter2\nusername: JaneDoe\tpassword: pass123"
    )
    print(Fore.CYAN + "=========================================")
    db.session.add_all([user1, user2])
    db.session.commit()

print("Creating admin role:")
admin_username = input("Choose an admin username (admin): ") or "admin"
admin_email = (
    input("Choose an admin email (<username>@readrecomend.com): ")
    or f"{admin_username}@readrecommend.com"
)

while True:
    admin_password1 = getpass("Choose an admin password: ")
    admin_password2 = getpass("Confirm password: ")
    if admin_password1 == admin_password2:
        break
    print(Fore.RED + "Passwords did not match, please try again")

print(Fore.CYAN + "=========================================")
print(
    Fore.CYAN
    + f"Admin info:\nusername: {admin_username} \tpassword: {'*'*len(admin_password2)}"
)
print(Fore.CYAN + "=========================================")

admin = Reader(
    username=admin_username,
    email="admin@readrecommend.com",
    password=guard.hash_password(admin_password2),
    roles="admin",
)
db.session.add(admin)
db.session.commit()

print("Training recommendation model...")
cr = ContentRecommender(force_retrain=True)

print(Fore.GREEN + "Setup complete!")
