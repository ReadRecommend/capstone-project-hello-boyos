from sqlalchemy import Column, Integer, String, DateTime

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Genre(Base):
    __tablename__ = 'genres'

    bookisbn      = Column(String, primary_key=True)
    genre          = Column(String)

    
    # TODO: contains

    def __init__(self, bookisbn, genre): 
        self.bookisbn       = bookisbn
        self.genre    = genre

    def __repr__(self):
       return "<Genre(bookisbn='%s', genre='%s')>" % ( 
                            self.bookisbn, self.genre)