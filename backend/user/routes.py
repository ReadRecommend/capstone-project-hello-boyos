from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.errors import ForbiddenResource, InvalidRequest, ResourceNotFound
from backend.model.schema import (
    Collection,
    Reader,
    collection_schema,
    reader_schema,
    readers_schema,
)
from backend.user import user_bp
from backend.user.utils import get_all_books, get_recently_read


@user_bp.route("/<username>")
def get_reader(username):
    reader = Reader.query.filter_by(username=username).first()
    if not reader:
        raise ResourceNotFound(f"A user with the username {username} does not exist")
    return jsonify(reader_schema.dump(reader))


@user_bp.route("/id/<id_>")
def get_reader_by_id(id_):
    if not isinstance(id_, int) and not id_.isdigit():
        raise InvalidRequest(
            r"Id should be an integer or a string interpretable as an integer",
        )

    reader = Reader.query.filter_by(id=id_).first()
    if not reader:
        raise ResourceNotFound(f"A user with the id {id_} does not exist")
    return jsonify(reader_schema.dump(reader))


@user_bp.route("/<username>/all_books")
def get_all_readers_books(username):
    reader = Reader.query.filter_by(username=username).first()
    if not reader:
        raise ResourceNotFound(f"A user with the username {username} does not exist")
    all_books = get_all_books(
        reader, sort_func=lambda membership: membership.book.title
    )
    all_collection = Collection(books=all_books, name="All", reader=reader)
    return jsonify(collection_schema.dump(all_collection))


@user_bp.route("/<username>/recently_read")
def get_readers_recently_read(username):
    reader = Reader.query.filter_by(username=username).first()
    if not reader:
        raise ResourceNotFound(f"A user with the username {username} does not exist")
    recently_read = get_recently_read(reader)
    return jsonify(collection_schema.dump(recently_read))


@user_bp.route("")
def get_readers():
    readers = Reader.query.all()
    return jsonify(readers_schema.dump(readers))


@user_bp.route("/<id_>", methods=["DELETE"])
@flask_praetorian.roles_required("admin")
def delete_reader(id_):
    if not isinstance(id_, int) and not id_.isdigit():
        raise InvalidRequest(
            r"Id should be an integer or a string interpretable as an integer",
        )
    reader = Reader.query.filter_by(id=id_).first()

    # Check user exists
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    # Check we are not deleting an admin
    if "admin" in reader.roles:
        raise ForbiddenResource("Cannot delete an admin")

    # Delete the user
    db.session.delete(reader)
    db.session.commit()

    # Return the new state of all users in the db
    users = Reader.query.all()
    return jsonify(readers_schema.dump(users))


@user_bp.route("/<username>/followers")
def get_followers(username):
    reader = Reader.query.filter_by(username=username).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    followers = reader.followers
    return jsonify(readers_schema.dump(followers))


@user_bp.route("/<username>/following")
def get_following(username):
    reader = Reader.query.filter_by(username=username).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")

    followings = reader.follows
    return jsonify(readers_schema.dump(followings))


@user_bp.route("/follow", methods=["POST", "DELETE"])
@flask_praetorian.auth_required
def follow():
    follow_data = request.json
    follower_username = follow_data.get("follower")
    reader_username = follow_data.get("user")

    if not (follower_username and reader_username):
        raise InvalidRequest(
            r"Request should be of the form {{follower: 'username', user: 'username'}}",
        )

    # Only the follower can request to follow
    if follower_username != flask_praetorian.current_user().username:
        raise ForbiddenResource(
            "You do not have the correct authorisation to access this resource"
        )

    reader = Reader.query.filter_by(username=reader_username).first()
    follower = Reader.query.filter_by(username=follower_username).first()

    if not reader or not follower:
        raise ResourceNotFound(
            "Either the follower or the user to follow does not exist"
        )

    # Add the follower relationship if it does not exist
    if request.method == "POST" and follower not in reader.followers:
        reader.followers.append(follower)
        db.session.add(reader)
        db.session.commit()

    # Delete the follower relationship if it does not exist
    if request.method == "DELETE" and follower in reader.followers:
        reader.followers.remove(follower)
        db.session.add(reader)
        db.session.commit()

    return jsonify(reader_schema.dump(follower))
