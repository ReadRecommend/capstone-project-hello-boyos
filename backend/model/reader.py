from backend import db
from backend.model.followers import followers
from werkzeug.security import generate_password_hash, check_password_hash


class Reader(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    collections = db.relationship("Collection", backref="reader", lazy=True)
    reviews = db.relationship("Review", backref="reader", lazy=True)

    follows = db.relationship(
        "Reader",
        secondary=followers,
        primaryjoin=(id == followers.c.follower_id),
        secondaryjoin=(id == followers.c.reader_id),
        backref="followers",
    )

    def __repr__(self):
        return f"<Reader(name='{self.username}', email='{self.email}')>"

    @property
    def identity(self):
        return self.id

    @property
    def rolenames(self):
        # We have no roles to implement so always return empty list
        return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, idx):
        return cls.query.get(idx)
