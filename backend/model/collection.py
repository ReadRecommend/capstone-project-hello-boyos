from backend import db
from sqlalchemy.ext.associationproxy import association_proxy


class Collection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    books = db.relationship("in_collections", back_populates="books")
    books = association_proxy("in_collections", "book")

    def __repr__(self):
        return "<Collection(name='%s', owner='%s', dateAdded='%s')>" % (
            self.name,
            self.owner,
            self.dateadded,
        )
