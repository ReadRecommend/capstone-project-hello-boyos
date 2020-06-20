from sqlalchemy import Column, Integer, String, DateTime

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class userGoal(Base):
    __tablename__ = 'usergoals'

    userid      = Column(Integer, primary_key=True)
    goal          = Column(Integer)

    
    # TODO: contains

    def __init__(self, userid, goal): 
        self.userid       = userid
        self.goal    = goal

    def __repr__(self):
       return "<Following(userid='%s', goal='%s')>" % ( 
                            self.userid, self.goal)