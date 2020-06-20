from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from user import User
from book import Book
from collection import Collection
from review import Review
from inCollection import inCollection
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


#                       sql type  ://username:password  @ip       /database       echo engine to stdout
engine = create_engine('postgresql://postgres:postgrease@localhost/database3900', echo = True)






meta = MetaData()

users = Table(
    'users', meta,
    Column('id', Integer, primary_key=True),
    Column('username', String),
    Column('email', String) 
)

books = Table(
    'books', meta,
    Column('isbn', String, primary_key=True),   
    Column('title', String),
    Column('author', String)
)

collections = Table(
    'collections', meta,
    Column('id', Integer, primary_key=True),
    Column('name', String),
    Column('ownerid', Integer)
)

inCollections = Table(
    'incollections', meta,
    Column('collectionid', Integer, primary_key=True),
    Column('bookisbn', String)
)

reviews = Table(
    'reviews', meta,
    Column('ownerid', Integer, primary_key=True),
    Column('bookisbn', String, primary_key=True),
    Column('review', String),
    Column('score', Integer)
)


meta.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Basic Usage
newUser = User('debugUser','debug@gmail.com')
session.add(newUser)

# I dunno how to write datetime
newBook = Book('debugISBN', 'debugTitle', 'debugAuthor', 'debugPublisher', '1-1-2000', 'English', 'image.png')
session.add(newBook)

newCollection = Collection('debugCollection', '123')
session.add(newCollection)

# in collections will have to be modified later to dynamically update.
newInCollection = inCollection('1', 'debugISBN')
session.add(newInCollection)

newReview = Review('123', 'debugISBN', 'debugReview', '5')
session.add(newReview)

newFollower = Follower('123', '321')
session.add(newFollower)

newAuthor = Author('Tim', 'debugISBN')
session.add(newAuthor)

newGenre = Genre('debugISBN', 'Horror')
session.add(newGenre)

newUserGoal = userGoal('123', '50')
session.add(newUserGoal)


session.commit()

# Query methods
# https://docs.sqlalchemy.org/en/13/orm/query.html
ourUsers = session.query(User).first()

print(ourUsers)


