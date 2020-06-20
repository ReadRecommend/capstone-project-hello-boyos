from sqlalchemy import Column, Integer, String, DateTime

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Collection(Base):
    __tablename__ = 'collections'

    id          = Column(Integer, primary_key=True)
    name        = Column(String)
    ownerid     = Column(Integer)


    
    # TODO: contains

    def __init__(self, name, ownerid): 
        self.name       = name
        self.ownerid    = ownerid

    def __repr__(self):
       return "<Collection(name='%s', owner='%s', dateAdded='%s')>" % ( 
                            self.name, self.owner, self.dateadded)
    
    def setID(self, id):
        self.id = id
    
    def setName(self, name):
        self.name = name
    
    def setownerid(self, ownerid):
        self.ownerid = ownerid
