from backend import db
from datetime import datetime


class Review(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    book_id = db.Column(db.String, primary_key=True)

    creation_date = db.Column(db.Datetime, default=datetime.utcnow())

    review = db.Column(db.String)
    score = db.Column(db.Integer)

    def __repr__(self):
        return f"<Review(user_id='{self.user_id}', book_isbn='{self.book_id}', creation_date='{self.creation_date}', score='{self.score}')>"
