from backend import db
from backend.model.author import authors
from backend.model.genre import genres
from sqlalchemy.ext.associationproxy import association_proxy


class Book(db.Model):
    isbn = db.Column(db.String, primary_key=True)
    title = db.Column(db.String, nullable=False)

    publisher = db.Column(db.String)
    publication_date = db.Column(db.Integer)

    language = db.Column(db.String)
    cover = db.Column(db.String)
    summary = db.Column(db.String)

    genres = db.relationship(
        "Genre",
        secondary=genres,
        lazy="subquery",
        backref=db.backref("books", lazy=True),
    )

    authors = db.relationship(
        "Author",
        secondary=authors,
        lazy="subquery",
        backref=db.backref("books", lazy=True),
    )

    collections = association_proxy("in_collections", "collection")

    # TODO: Reviews

    def __repr__(self):
        return f"<Book(title='{self.title}, authors='{self.author}', publisher='{self.publisher}')>"
