from backend import app, db, ma
from backend.model.author import Author
from backend.model.book import Book
from backend.model.collection import Collection
from backend.model.collection_membership import CollectionMembership
from backend.model.genre import Genre
from backend.model.review import Review
from backend.model.reader import Reader
from backend.model.reader_goal import ReaderGoal


class BookSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Book
        include_relationships = True

    n_readers = ma.Function(
        lambda book: CollectionMembership.query.filter_by(book_id=book.id)
        .join(Collection)
        .join(Reader)
        .distinct(Reader.id)
        .count()
    )


book_schema = BookSchema()
books_schema = BookSchema(many=True)


class AuthorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Author
        include_relationships = True

    books = ma.Nested(BookSchema, many=True)


author_schema = AuthorSchema()
authors_schema = AuthorSchema(many=True)


class CollectionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Collection
        include_relationships = True
        exclude = ("book_memberships",)

    books = ma.Nested(BookSchema, many=True)


collection_schema = CollectionSchema()
collections_schema = CollectionSchema(many=True)


class SimpleReader(ma.SQLAlchemySchema):
    class Meta:
        model = Reader

    id = ma.auto_field()
    username = ma.auto_field()


class ReaderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Reader
        include_relationships = True
        exclude = ("password",)

    collections = ma.Nested(CollectionSchema, many=True, only=["id", "name"])
    followers = ma.Nested(SimpleReader, many=True)
    follows = ma.Nested(SimpleReader, many=True)
    roles = ma.Function(lambda user: user.roles.split(","))


reader_schema = ReaderSchema()
readers_schema = ReaderSchema(many=True)


class GenreSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Genre
        include_relationships = True

    books = ma.Nested(BookSchema, many=True)


genre_schema = GenreSchema()
genres_schema = GenreSchema(many=True)


class ReviewSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Review
        include_relationships = True

    reader = ma.Nested(SimpleReader)


review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)


class ReaderGoalSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ReaderGoal
        include_relationships = True


goal_schema = ReaderGoalSchema()
goals_schema = ReaderGoalSchema(many=True)
