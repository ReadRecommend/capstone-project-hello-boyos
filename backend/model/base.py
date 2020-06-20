from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, DateTime
from user import User
from book import Book
from collection import Collection
from review import Review
from inCollection import inCollection
from following import Follower
from genre import Genre
from usergoal import userGoal
from author import Author
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func


#                       sql type  ://username:password  @ip       /database       echo engine to stdout
engine = create_engine(
    "postgresql://postgres:postgrease@localhost/database3900", echo=True
)

meta = MetaData()

users = Table(
    "users",
    meta,
    Column("id", Integer, primary_key=True),
    Column("username", String),
    Column("email", String),
)

books = Table(
    "books",
    meta,
    Column("isbn", String, primary_key=True),
    Column("title", String),
    Column("publisher", String),
    Column("publicationdate", DateTime),
    Column("language", String),
    Column("cover", String),
    Column("summary", String),
)

collections = Table(
    "collections",
    meta,
    Column("id", Integer, primary_key=True),
    Column("name", String),
    Column("ownerid", Integer),
)

inCollections = Table(
    "incollections",
    meta,
    Column("collectionid", Integer, primary_key=True),
    Column("bookisbn", String),
    Column("dateadded", DateTime),
)

reviews = Table(
    "reviews",
    meta,
    Column("ownerid", Integer, primary_key=True),
    Column("bookisbn", String, primary_key=True),
    Column("review", String),
    Column("score", Integer),
)

usergoal = Table(
    "usergoals",
    meta,
    Column("userid", Integer, primary_key=True),
    Column("goal", Integer),
)

author = Table(
    "authors",
    meta,
    Column("author", String, primary_key=True),
    Column("bookisbn", String, primary_key=True),
)

genre = Table(
    "genres",
    meta,
    Column("bookisbn", String, primary_key=True),
    Column("genre", String),
)

following = Table(
    "followers",
    meta,
    Column("userid", Integer, primary_key=True),
    Column("followerid", Integer, primary_key=True),
)

meta.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Basic Usage
newUser = User("debugUser", "debug@gmail.com")
session.add(newUser)


# in collections will have to be modified later to dynamically update.
newInCollection = inCollection("1", "debugISBN", "20160622 01:23:45")
session.add(newInCollection)

newReview = Review("123", "debugISBN", "debugReview", "5")
session.add(newReview)

newFollower = Follower("123", "321")
session.add(newFollower)

newAuthor = Author("Tim", "debugISBN")
session.add(newAuthor)

newGenre = Genre("debugISBN", "Horror")
session.add(newGenre)

newUserGoal = userGoal("123", "50")
session.add(newUserGoal)

# I dunno how to write DateTime
newBook = Book(
    "debugISBN",
    "debugTitle",
    "debugPublisher",
    "20160622",
    "English",
    "image.png",
    "A cool summary",
)
session.add(newBook)

newCollection = Collection("debugCollection", "123")
session.add(newCollection)

session.commit()

# Query methods
# https://docs.sqlalchemy.org/en/13/orm/query.html
ourUsers = session.query(User).first()

print(ourUsers)
