from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.user import user_bp
from backend.errors import (
    InvalidRequest,
    ResourceNotFound,
    ForbiddenResource,
)
from backend.model.schema import Reader, reader_schema, readers_schema


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


@user_bp.route("")
def get_readers():
    readers = Reader.query.all()
    return jsonify(readers_schema.dump(readers))


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
