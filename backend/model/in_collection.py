from backend import db
from datetime import datetime
from backend.model.book import Book
from backend.model.collection import Collection


class InCollection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.String, db.ForeignKey("book.id"))
    collection_id = db.Column(db.Integer, db.ForeignKey("collection.id"))
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())

    collection = db.relationship(Collection, backref="in_collections")
    book = db.relationship(Book, backref="in_collections")

    def __repr__(self):
        return f"<InCollection(id='{self.id}', book_isbn='{self.book_id}', collection_id='{self.collection_id}')>"
