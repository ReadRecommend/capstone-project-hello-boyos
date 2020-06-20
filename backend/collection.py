from sqlalchemy import Column, Integer, String, DateTime

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Collection(Base):
    __tablename__ = 'collections'

    id          = Column(Integer, primary_key=True)
    name        = Column(String)
    ownerid     = Column(Integer)

    dateAdded   = Column(DateTime)

    
    # TODO: contains

    def __init__(self, name, ownerid, dateAdded): 
        self.name       = name
        self.ownerid    = ownerid
        self.dateAdded  = dateAdded

    def __repr__(self):
       return "<Collection(name='%s', owner='%s', dateAdded='%s')>" % ( 
                            self.name, self.owner, self.dateAdded)
    
    def setID(self, id):
        self.id = id
    
    def setName(self, name):
        self.name = name
    
    def setownerid(self, ownerid):
        self.ownerid = ownerid
