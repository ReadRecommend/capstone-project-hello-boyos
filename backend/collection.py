from sqlalchemy import Column, Integer, String

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Collection(Base):
    __tablename__ = 'collections'

    id          = Column(Integer, primary_key=True)
    name        = Column(String)
    ownerID       = Column(Integer)

    
    # TODO: contains





    def __repr__(self):
       return "<Collection(name='%s', owner='%s', createdOn='%s')>" % ( 
                            self.name, self.owner, self.createdOn)
