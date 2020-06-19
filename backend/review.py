from sqlalchemy import Column, Integer, String

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Review(Base):
    __tablename__ = 'reviews'

    id          = Column(Integer, primary_key=True)
    ownerid     = Column(Integer)
    bookisbn    = Column(String)

    # createdOn   = Column(String)

    # review      = Column(String)
    # score       = Column(Integer)

    def __init__(self, ownerid, bookisbn): 
        self.ownerid    = ownerid
        self.bookisbn   = bookisbn

    def __repr__(self):
       return "<Review(name='%s', owner='%s', bookisbn='%s')>" % ( 
                            self.name, self.ownerid, self.bookisbn)

    def setID(self, id):
        self.id = id

    def setownerid(self, ownerid):
        self.ownerid = ownerid

    def setbookisbn(self, bookisbn):
        self.bookisbn = bookisbn
