from backend import db
from backend.model.author import authors
from backend.model.genre import genres
from backend.model.collection_membership import CollectionMembership
from sqlalchemy.ext.associationproxy import association_proxy


class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.String, unique=True)
    title = db.Column(db.String, nullable=False)

    publisher = db.Column(db.String)
    publication_date = db.Column(db.Integer)

    language = db.Column(db.String)
    cover = db.Column(db.String)
    summary = db.Column(db.String)

    ave_rating = db.Column(db.Float, default=0.0)
    n_ratings = db.Column(db.Integer, default=0)

    genres = db.relationship(
        "Genre",
        secondary=genres,
        lazy="subquery",
        backref=db.backref("books", lazy=True),
    )

    authors = db.relationship(
        "Author",
        secondary=authors,
        lazy="dynamic",
        backref=db.backref("books", lazy=True),
    )

    collection_memberships = db.relationship(
        "CollectionMembership", back_populates="book"
    )
    collections = association_proxy(
        "collection_memberships",
        "collection",
        creator=lambda collection: CollectionMembership(collection=collection),
    )

    def __repr__(self):
        return f"<Book(title='{self.title}, authors='{self.authors}', publisher='{self.publisher}')>"
