from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from user import User
from book import Book
from collection import Collection
from review import Review
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
    Column('ownerid', Integer),
    Column('bookisbn', String)
)

reviews = Table(
    'reviews', meta,
    Column('id', Integer, primary_key=True),
    Column('ownerid', Integer),
    Column('bookisbn', String)
)


meta.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

# Basic Usage
newUser = User('debugUser','debug@gmail.com')
session.add(newUser)

newBook = Book('debugISBN', 'debugTitle', 'debugAuthor')
session.add(newBook)

newCollection = Collection('debugCollection', '123', 'debugISBN')
session.add(newCollection)

newReview = Review('123', 'debugISBN')
session.add(newReview)
session.commit()



session.commit()

# Query methods
# https://docs.sqlalchemy.org/en/13/orm/query.html
ourUsers = session.query(User).first()

print(ourUsers)


