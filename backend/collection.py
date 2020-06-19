from sqlalchemy import Column, Integer, String

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Collection(Base):
    __tablename__ = 'collections'

    id          = Column(Integer, primary_key=True)
    name        = Column(String)
    ownerid     = Column(Integer)
    bookisbn    = Column(String)

    
    # TODO: contains

    def __init__(self, name, ownerid, bookisbn): 
        self.name       = name
        self.ownerid    = ownerid
        self.bookisbn   = bookisbn

    def __repr__(self):
       return "<Collection(name='%s', owner='%s', createdOn='%s')>" % ( 
                            self.name, self.owner, self.createdOn)
    
    def setID(self, id):
        self.id = id
    
    def setName(self, name):
        self.name = name
    
    def setownerid(self, ownerid):
        self.ownerid = ownerid
