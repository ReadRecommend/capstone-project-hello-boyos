from flask import jsonify, request
import dateutil.parser

import flask_praetorian
from backend import db
from backend.goals import goals_bp
from backend.errors import InvalidRequest, ResourceExists, ResourceNotFound
from backend.model.schema import ReaderGoalSchema, ReaderGoal, goal_schema, goals_schema


@goals_bp.route("/<year>", methods=["GET"])
@flask_praetorian.roles_required("user")
def get_goals(year):

    try:
        reader_goals = ReaderGoal.query.filter_by(
            year=year, reader_id=flask_praetorian.current_user().id
        ).all()

        return jsonify(goals_schema.dump(reader_goals))
    except:
        raise InvalidRequest("Invalid Request")


@goals_bp.route("", methods=["PUT"])
@flask_praetorian.roles_required("user")
def update_goal():
    goal_data = request.json
    month = goal_data.get("month")
    year = goal_data.get("year")
    goal = goal_data.get("goal")
    n_read = goal_data.get("n_read")

    # Check the request has all the values we are expecting
    if not (month != None and year != None and goal != None and n_read != None):
        raise InvalidRequest(
            "Request should be of the form {{month: 'month', year: 'year', goal: 'goal', n_read: 'n_read'}}"
        )

    # Sanity check values
    try:
        year = int(year)
        month = int(month)
        goal = int(goal)
        n_read = int(n_read)
    except:
        raise InvalidRequest("Year, month and n_read must be integers")

    if month < 1 or month > 12:
        raise InvalidRequest("Month must be in the range 1-12")

    if year < 0:
        raise InvalidRequest("Year must be >= 0")

    if n_read < 0:
        raise InvalidRequest("N_read must be >= 0")

    if goal < 1:
        raise InvalidRequest("Goal must be >= 1")

    reader_goal = ReaderGoal.query.filter_by(
        month=month, year=year, reader_id=flask_praetorian.current_user().id
    ).first()

    if reader_goal:
        # We are overwriting an existing goal
        reader_goal.goal = goal
        reader_goal.n_read = n_read

        db.session.add(reader_goal)
        db.session.commit()

        return jsonify(goal_schema.dump(reader_goal))
    else:
        # We are creating a new goal
        new_goal = ReaderGoal(
            month=month,
            year=year,
            reader_id=flask_praetorian.current_user().id,
            goal=goal,
            n_read=n_read,
        )

        db.session.add(new_goal)
        db.session.commit()

        return jsonify(goal_schema.dump(new_goal))

