from backend import db

genres = db.Table(
    "genres",
    db.Column("book_id", db.Integer, db.ForeignKey("book.id"), primary_key=True),
    db.Column("genre_id", db.String, db.ForeignKey("genre.name"), primary_key=True),
)


class Genre(db.Model):
    name = db.Column(db.String, primary_key=True)

    def __repr__(self):
        return f"<Genre(name='{self.name}')>"
