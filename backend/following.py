from sqlalchemy import Column, Integer, String, DateTime

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Follower(Base):
    __tablename__ = 'followers'

    userid          = Column(Integer, primary_key=True)
    followerid      = Column(Integer, primary_key=True)

    
    # TODO: contains

    def __init__(self, userid, followerid): 
        self.userid       = userid
        self.followerid    = followerid

    def __repr__(self):
       return "<Following(userid='%s', followerid='%s')>" % ( 
                            self.userid, self.followerid)