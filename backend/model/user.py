from backend import db
from werkzeug.security import generate_password_hash
from backend.model.followers import followers


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    collections = db.relationship("Collection", backref="user", lazy=True)
    reviews = db.relationship("Review", backref="user", lazy=True)

    follows = db.relationship(
        "User",
        secondary=followers,
        primaryjoin=(id == followers.c.follower_id),
        secondaryjoin=(id == followers.c.user_id),
        backref="follows",
    )

    def __repr__(self):
        return f"<User(name='{self.username}', email='{self.email}')>"

    @property
    def password(self):
        return self.password

    @password.setter
    def password(self, password):
        self.password = generate_password_hash(password)
