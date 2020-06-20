from sqlalchemy import Column, Integer, String, DateTime

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Author(Base):
    __tablename__ = 'authors'

    author          = Column(String, primary_key=True)
    bookisbn      = Column(String, primary_key=True)

    
    # TODO: contains

    def __init__(self, author, bookisbn): 
        self.author       = author
        self.bookisbn    = bookisbn

    def __repr__(self):
       return "<Author(author='%s', bookisbn='%s')>" % ( 
                            self.author, self.bookisbn)