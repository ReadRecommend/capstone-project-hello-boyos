from flask import jsonify, request
import datetime
import calendar

import flask_praetorian
from backend import db
from backend.errors import InvalidRequest
from backend.goals import goals_bp
from backend.goals.utils import validate_goal
from backend.model.schema import (
    ReaderGoal,
    Reader,
    Collection,
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

    for month in range(1, 13):
        # Count the amount of books we added to collections for each month
        num_days = calendar.monthrange(year, month)[1]
        start_date = datetime.date(year, month, 1)
        end_date = datetime.date(year, month, num_days)
        n_read = (
            CollectionMembership.query.filter(
                CollectionMembership.date_added >= start_date,
                CollectionMembership.date_added <= end_date,
            )
            .join(Collection, Collection.id == CollectionMembership.collection_id)
            .join(Reader, Reader.id == reader.id)
            .distinct(CollectionMembership.book_id)
            .count()
        )

        print(n_read)
        if n_read > 0:
            found_goal = False
            for goal in goals:
                if goal["month"] == month:
                    goal["n_read"] = n_read
                    found_goal = True
                    break
            if found_goal == False:
                # No goal set for this month, but still need to return n_read
                new_goal = {
                    "month": month,
                    "year": year,
                    "goal": None,
                    "n_read": n_read,
                }
                goals.append(new_goal)

    print(goals)
    return jsonify(goals)


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
