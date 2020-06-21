from backend import app, db, ma
from backend.model.author import Author
from backend.model.book import Book
from backend.model.collection import Collection
from backend.model.genre import Genre
from backend.model.review import Review
from backend.model.user import User


class AuthorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Author
        include_fk = True


author_schema = AuthorSchema()
authors_schema = AuthorSchema(many=True)


class BookSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Book
        include_fk = True


book_schema = BookSchema()
books_schema = BookSchema(many=True)


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_fk = True


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class GenreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Genre
        include_fk = True


genre_schema = GenreSchema()
genres_schema = GenreSchema(many=True)
