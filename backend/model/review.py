from backend import db
from datetime import datetime
from backend.model.reader import Reader
from sqlalchemy.ext.associationproxy import association_proxy


class Review(db.Model):
    reader_id = db.Column(db.Integer, db.ForeignKey("reader.id"), primary_key=True)
    book_id = db.Column(db.Integer, primary_key=True)

    creation_date = db.Column(db.DateTime, default=datetime.utcnow())

    review = db.Column(db.String)
    score = db.Column(db.Integer)

    reader = association_proxy(
        "reader", "reader", creator=lambda username: Reader(username=username)
    )

    def __repr__(self):
        return f"<Review(reader_id='{self.reader_id}', book_id='{self.book_id}', creation_date='{self.creation_date}', score='{self.score}')>"
