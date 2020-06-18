from sqlalchemy import Column, Integer, String

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Review(Base):
    __tablename__ = 'reviews'

    id          = Column(Integer, primary_key=True)
    ownerID     = Column(Integer)
    bookISBN    = Column(String)

    # createdOn   = Column(String)

    # review      = Column(String)
    # score       = Column(Integer)


    def __repr__(self):
       return "<Review(name='%s', owner='%s', bookISBN='%s')>" % ( 
                            self.name, self.ownerID, self.bookISBN)
