from sqlalchemy import Column, Integer, String

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id          = Column(Integer, primary_key=True)
    username    = Column(String)
    email       = Column(String)



    # TODO:Collections here

    def __init__(self, username, email): 
        # self.id         = id
        self.username   = username
        self.email      = email


    def __repr__(self):
       return "<User(name='%s', fullname='%s', email='%s')>" % ( 
                            self.username, self.email, self.email)
