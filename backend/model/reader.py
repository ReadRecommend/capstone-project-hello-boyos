from backend import db
from backend.model.followers import followers


class Reader(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    roles = db.Column(db.String, nullable=False)

    collections = db.relationship(
        "Collection", backref="reader", lazy=True, cascade="all,delete"
    )
    reviews = db.relationship(
        "Review", backref="reader", lazy=True, cascade="all,delete"
    )

    follows = db.relationship(
        "Reader",
        secondary=followers,
        primaryjoin=(id == followers.c.follower_id),
        secondaryjoin=(id == followers.c.reader_id),
        backref="followers",
        cascade="all,delete",
    )

    def __repr__(self):
        return f"<Reader(name='{self.username}', email='{self.email}')>"

    @property
    def identity(self):
        """Get the unique identifier of a user

        This method is required by Flask-Praetorian

        Returns:
            int: The user's unique identifier
        """
        return self.id

    @property
    def rolenames(self):
        """Return the roles a given user has as a list of strings

        User roles should be stores as a single comma separated string
        This method is required by Flask-Praetorian

        Returns:
            List[str]: The list of rolenames
        """
        return self.roles.split(",")

    @classmethod
    def lookup(cls, username):
        """Find the user with a given username
        
        This method is required by Flask-Praetorian

        Args:
            cls: The class (table) to search for the user in
            username (str): The username to search for

        Returns:
            Reader: The user with the specified username
        """
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, idx):
        """Find the user with a given id
        
        This method is required by Flask-Praetorian

        Args:
            cls: The class (table) to search for the user in
            idx (int): The id to search for

        Returns:
            Reader: The user with the specified id
        """
        return cls.query.get(idx)
