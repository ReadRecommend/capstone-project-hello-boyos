import os

import tempfile

import pytest

import backend


@pytest.fixture
def client():
    """Initialise the application with an empty temporary database

    Yields:
        client: A client associated with the app instance
    """
    db_file, db_filename = tempfile.mkstemp(suffix=".db")
    backend.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + db_filename
    backend.app.config["TESTING"] = True
    backend.db.create_all()

    with backend.app.test_client() as client:
        yield client

    os.close(db_file)


class TestEmpty:
    def test_empty_get_books(self, client):
        assert client.get("/book").json == []

    def test_non_exist_book(self, client):
        assert client.get("/book/1234").status_code == 404

    def test_empty_get_users(self, client):
        assert client.get("/user").json == []

    def test_non_exist_user(self, client):
        assert client.get("/user/1234").status_code == 404

    def test_empty_get_authors(self, client):
        assert client.get("/author").json == []

    def test_empty_get_genres(self, client):
        assert client.get("/genre").json == []
