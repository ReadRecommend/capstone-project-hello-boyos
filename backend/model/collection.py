from backend import db
from backend.model.collection_membership import CollectionMembership
from sqlalchemy.ext.associationproxy import association_proxy


class Collection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    reader_id = db.Column(db.Integer, db.ForeignKey("reader.id"), nullable=False)

    book_memberships = db.relationship(
        "CollectionMembership", back_populates="collection"
    )
    books = association_proxy("book_memberships", "book")

    def __repr__(self):
        return f"<Collection(name='{self.name}', owner='{self.reader}', books='{self.books}')>"
