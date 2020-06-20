from sqlalchemy import Column, Integer, String

from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class inCollection(Base):
    __tablename__ = "incollections"
    collectionid = Column(Integer, primary_key=True)
    bookisbn = Column(String)
    dateadded   = Column(DateTime)

    def __init__(self, collectionid, bookisbn, dateAdded):
        self.collectionid = collectionid
        self.bookisbn = bookisbn
        self.dateadded  = dateAdded

    def __repr__(self):
        return "<Review(name='%s', owner='%s', bookisbn='%s')>" % (
            self.name,
            self.ownerid,
            self.bookisbn,
        )

