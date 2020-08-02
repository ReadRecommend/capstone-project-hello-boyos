import os

import tempfile

import pytest

import backend
from backend.model.schema import reader_schema


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

    # Create some dummy users
    user1 = backend.model.reader.Reader(
        username="user1", email="user1@example.com", password="hunter2"
    )
    user2 = backend.model.reader.Reader(
        username="user2", email="user2@example.com", password="hunter3"
    )
    backend.db.session.rollback()
    backend.db.session.add(user1)
    backend.db.session.add(user2)
    backend.db.session.commit()

    with backend.app.test_client() as client:
        yield client

    os.close(db_file)


class TestFollowers:
    def test_no_followers(self, client):
        assert client.get("/followers/user1").json == []
        assert client.get("/followers/user2").json == []

    def test_no_following(self, client):
        assert client.get("/following/user1").json == []
        assert client.get("/following/user2").json == []

    def test_add_follower(self, client):
        response = client.post("/follow", json={"user": "user1", "follower": "user2"})
        assert response.status_code == 200
        assert client.get("/followers/user1").json[0]["username"] == "user2"
        assert client.get("/following/user2").json[0]["username"] == "user1"

    def test_remove_follower(self, client):
        client.post("/follow", json={"user": "user1", "follower": "user2"})
        response = client.delete("/follow", json={"user": "user1", "follower": "user2"})

        assert response.status_code == 200
        assert client.get("/followers/user1").json == []
        assert client.get("/following/user2").json == []

    def test_malformed_request(self, client):
        response = client.post("/follow", json={"INVALID": 123})
        assert response.status_code == 400
        response = client.delete("/follow", json={"INVALID": 123})
        assert response.status_code == 400
