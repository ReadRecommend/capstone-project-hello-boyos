from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from user import User
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#                       sql type  ://username:password  @ip       /database
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
    Column('ownerID', Integer)
)

reviews = Table(
    'reviews', meta,
    Column('id', Integer, primary_key=True),
    Column('ownerID', Integer),
    Column('bookISBN', String)
)


meta.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()

newUser = User('debug','debug@gmail.com')
session.add(newUser)

newUser2 = User('debug2','debug2@gmail.com')
session.add(newUser2)


session.commit()
# ourUsers = session.query(User).all()
# print(ourUsers)

# print(User)