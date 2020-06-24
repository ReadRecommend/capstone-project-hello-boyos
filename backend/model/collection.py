from backend import db
from sqlalchemy.ext.associationproxy import association_proxy


class Collection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    reader_id = db.Column(db.Integer, db.ForeignKey("reader.id"), nullable=False)

    books = db.relationship("in_collection", back_populates="books")
    books = association_proxy("in_collection", "book")

    def __repr__(self):
        return "<Collection(name='%s', owner='%s', dateAdded='%s')>" % (
            self.name,
            self.owner,
            self.dateadded,
        )
