from backend import db

authors = db.Table(
    "authors",
    db.Column("author_id", db.String, db.ForeignKey("author.name"), primary_key=True),
    db.Column("book_id", db.String, db.ForeignKey("book.isbn"), primary_key=True),
)
from backend import db


class Author(db.Model):
    name = db.Column(db.String, primary_key=True)

    def __repr__(self):
        return f"<Author(name='{self.name}')>"
