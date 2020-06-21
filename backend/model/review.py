from backend import db
from datetime import datetime


class Review(db.Model):
    reader_id = db.Column(db.Integer, db.ForeignKey("reader.id"), primary_key=True)
    book_id = db.Column(db.String, primary_key=True)

    creation_date = db.Column(db.DateTime, default=datetime.utcnow())

    review = db.Column(db.String)
    score = db.Column(db.Integer)

    def __repr__(self):
        return f"<Review(reader_id='{self.reader_id}', book_isbn='{self.book_id}', creation_date='{self.creation_date}', score='{self.score}')>"
