from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.user import user_bp
from backend.user.utils import get_recently_read, get_all_books
from backend.errors import (
    InvalidRequest,
    ResourceNotFound,
    ForbiddenResource,
)
from backend.model.schema import (
    Reader,
    collection_schema,
    reader_schema,
    readers_schema,
)


@user_bp.route("/<username>")
def get_reader(username):
    reader = Reader.query.filter_by(username=username).first()
    if not reader:
        raise ResourceNotFound(f"A user with the username {username} does not exist")
    return jsonify(reader_schema.dump(reader))


@user_bp.route("/id/<id>")
def get_reader_by_id(id):
    if not isinstance(id, int) and not id.isdigit():
        raise InvalidRequest(
            r"Id should be an integer or a string interpretable as an integer",
        )

    reader = Reader.query.filter_by(id=id).first()
    if not reader:
        raise ResourceNotFound(f"A user with the id {id} does not exist")
    return jsonify(reader_schema.dump(reader))


@user_bp.route("/<username>/all_books")
def get_all_readers_books(username):
    reader = Reader.query.filter_by(username=username).first()
    if not reader:
        raise ResourceNotFound(f"A user with the username {username} does not exist")
    all_books = get_all_books(reader)
    return jsonify(collection_schema.dump(all_books))


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


@user_bp.route("/<id>", methods=["DELETE"])
@flask_praetorian.roles_required("admin")
def delete_reader(id):
    if not isinstance(id, int) and not id.isdigit():
        raise InvalidRequest(
            r"Id should be an integer or a string interpretable as an integer",
        )
    reader = Reader.query.filter_by(id=id).first()

    # Check user exists
    if not (reader):
        raise ResourceNotFound("User does not exist")

    # Check we are not deleting an admin
    if reader.roles.find("admin") != -1:
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
    followers = reader.followers
    return jsonify(readers_schema.dump(followers))


@user_bp.route("/<username>/following")
def get_following(username):
    reader = Reader.query.filter_by(username=username).first()
    followings = reader.follows
    return jsonify(readers_schema.dump(followings))


@user_bp.route("/follow", methods=["POST", "DELETE"])
@flask_praetorian.auth_required
def follow():
    follower_username = request.json.get("follower")
    reader_username = request.json.get("user")

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
