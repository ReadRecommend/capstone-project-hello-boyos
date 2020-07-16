from backend import db

authors = db.Table(
    "authors",
    db.Column("author_id", db.String, db.ForeignKey("author.name"), primary_key=True),
    db.Column("book_id", db.Integer, db.ForeignKey("book.id"), primary_key=True),
)


class Author(db.Model):
    name = db.Column(db.String, primary_key=True)

    def __repr__(self):
        return f"<Author(name='{self.name}')>"
