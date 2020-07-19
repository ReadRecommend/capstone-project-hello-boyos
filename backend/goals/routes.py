from flask import jsonify, request

import flask_praetorian
from backend import db
from backend.goals import goals_bp
from backend.errors import InvalidRequest, ResourceExists, ResourceNotFound


@goals_bp.route("", methods=["GET"])
@flask_praetorian.roles_required("user")
def get_goal():

    return ""

@goals_bp.route("", methods=["PUT"])
@flask_praetorian.roles_required("user")
def update_goal():

    return ""