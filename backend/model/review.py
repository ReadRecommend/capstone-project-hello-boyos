from sqlalchemy import Column, Integer, String

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Review(Base):
    __tablename__ = 'reviews'

    ownerid     = Column(Integer, primary_key=True)
    bookisbn    = Column(String, primary_key=True)

    # createdOn   = Column(String)

    review      = Column(String)
    score       = Column(Integer)

    def __init__(self, ownerid, bookisbn, review, score): 
        self.ownerid    = ownerid
        self.bookisbn   = bookisbn
        self.review     = review
        self.score      = score

    def __repr__(self):
       return "<Review(name='%s', owner='%s', bookisbn='%s')>" % ( 
                            self.name, self.ownerid, self.bookisbn)



    def setOwnerID(self, ownerid):
        self.ownerid = ownerid

    def setbookisbn(self, bookisbn):
        self.bookisbn = bookisbn

    def setreview(self, review):
        self.review = review

    def setscore(self, score):
        self.score = score
