from backend import db
from backend.model.schema import ReaderGoal
from backend.errors import InvalidRequest


def increase_goal(user_id, month, year):
    """ Increase the n_read value of a goal at the corresponding month/year, 
    or create a new one if it doesn't exist.

    Args:
        user_id (int): Id of the user whose goals we are modifying
        month (int, 1 <= month <= 12): The month of the goal
        year (int, year >= 0): The year of the goal

    Returns:
        None
    """
    goal = ReaderGoal.query.filter_by(reader_id=user_id, month=month, year=year).first()

    if not goal:
        # Aren't tracking books for this month, start tracking.
        # Note the goals attribute is set to null here
        new_goal = ReaderGoal(month=month, year=year, reader_id=user_id, n_read=1,)
        db.session.add(new_goal)
    else:
        # Already existing goal, increase amount of books we've read this month by 1
        goal.n_read += 1
        db.session.add(goal)

    db.session.commit()


def decrease_goal(user_id, month, year):
    """ Decrease the n_read value of a goal at the corresponding month/year, 
    or do nothing if the goal for this month doesn't exist.

    Args:
        user_id (int): Id of the user whose goals we are modifying
        month (int, 1 <= month <= 12): The month of the goal
        year (int, year >= 0): The year of the goal

    Returns:
        None
    """
    goal = ReaderGoal.query.filter_by(reader_id=user_id, month=month, year=year).first()

    if goal:
        # Books are being tracked this month, subtract n_read by one
        goal.n_read -= 1

        if goal.n_read <= 0:
            # If we have now read no books this month, stop tracking
            db.session.delete(goal)
        else:
            # Else update the new value in the database
            db.session.add(goal)

        db.session.commit()


def validate_goal(month, year, goal, n_read):
    """ Validate the values that will be given to create a new goal, raising an error if something is wrong.

    Args:
        month (int): The month of the goal
        year (int): The year of the goal
        goal (int): The goal number of books to read for this month/year
        n_read (int): The number of books already read on this month/year

    Returns:
        None
    Raises:
        InvalidRequest: If any of month, year, goal, or n_read are not valid values

    """
    if month < 1 or month > 12:
        raise InvalidRequest("Month must be in the range 1-12")

    if year < 0:
        raise InvalidRequest("Year must be >= 0")

    if n_read < 0:
        raise InvalidRequest("n_read must be >= 0")

    if goal < 1:
        raise InvalidRequest("Goal must be >= 1")
