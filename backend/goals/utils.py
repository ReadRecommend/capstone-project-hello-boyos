from backend import db
from backend.model.schema import ReaderGoal
from backend.errors import InvalidRequest


def validate_goal(month, year, goal):
    """ Validate the values that will be given to create a new goal, raising an error if something is wrong.

    Args:
        month (int): The month of the goal
        year (int): The year of the goal
        goal (int): The goal number of books to read for this month/year

    Returns:
        None
    Raises:
        InvalidRequest: If any of month, year, or goal are not valid values

    """
    if month < 1 or month > 12:
        raise InvalidRequest("Month must be in the range 1-12")

    if year < 0:
        raise InvalidRequest("Year must be >= 0")

    if goal < 1:
        raise InvalidRequest("Goal must be >= 1")
