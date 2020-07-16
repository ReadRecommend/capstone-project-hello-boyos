from datetime import datetime

from backend import db


class CollectionMembership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey("book.id"))
    collection_id = db.Column(db.Integer, db.ForeignKey("collection.id"))
    date_added = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())

    collection = db.relationship("Collection", back_populates="book_memberships")
    book = db.relationship("Book", back_populates="collection_memberships")

    def __repr__(self):
        return f"<Membership(id='{self.id}', book_title='{self.book.title}', collection_name='{self.collection.name}', date_added='{self.date_added}')>"
