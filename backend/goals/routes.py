from flask import jsonify, request
import datetime
import calendar

import flask_praetorian
from backend import db
from backend.errors import InvalidRequest
from backend.goals import goals_bp
from backend.goals.utils import get_all_goals, validate_goal
from backend.model.schema import (
    ReaderGoal,
    Reader,
    CollectionMembership,
    goal_schema,
    goals_schema,
)
from backend.utils import extract_integers


@goals_bp.route("/<year>", methods=["GET"])
@flask_praetorian.roles_required("user")
def get_goals(year):
    try:
        year = int(year)
    except:
        # This catches if the year is not an integer
        raise InvalidRequest("Invalid Request")

    reader = Reader.query.filter_by(id=flask_praetorian.current_user().id).first()

    reader_goals = ReaderGoal.query.filter_by(year=year, reader_id=reader.id).all()
    goals = goals_schema.dump(reader_goals)
    all_goals = get_all_goals(goals, reader, year)

    return jsonify(all_goals)


@goals_bp.route("", methods=["PUT"])
@flask_praetorian.roles_required("user")
def update_goal():
    goal_data = request.json
    month, year, goal = extract_integers(goal_data, ["month", "year", "goal"])

    validate_goal(month, year, goal)

    reader_goal = ReaderGoal.query.filter_by(
        month=month, year=year, reader_id=flask_praetorian.current_user().id
    ).first()

    if reader_goal:
        # We are overwriting an existing goal
        reader_goal.goal = goal

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
        )

        db.session.add(new_goal)
        db.session.commit()

        return jsonify(goal_schema.dump(new_goal))
