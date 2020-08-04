from backend.model.schema import CollectionMembership
from backend.errors import InvalidRequest
import pendulum


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


def get_all_goals(goals, reader, year):
    """Returns a list of all a reader's goals in a given year.

    If a reader has no goal set, but still has read books that month then a goal will be added.
    The number of books read each month is also calculated here

    Args:
        goals (List[Goal]): A list of Goals the reader has set
        reader (Reader): The reader requesting their goals
        year (int): The year to get the goals for
    """
    # Count the amount of books we added to collections for each month
    for month in range(1, 13):
        start_date = pendulum.date(year, month, 1)
        end_date = start_date.add(months=1)
        n_read = (
            CollectionMembership.query.filter(
                CollectionMembership.date_added >= start_date,
                CollectionMembership.date_added <= end_date,
                CollectionMembership.collection.has(reader_id=reader.id),
            )
            .distinct(CollectionMembership.book_id)
            .count()
        )

        if n_read > 0:
            if month_goal := [goal for goal in goals if goal["month"] == month][0]:
                month_goal["n_read"] = n_read
            else:
                # No goal set for this month, but still need to return n_read
                new_goal = {
                    "month": month,
                    "year": year,
                    "goal": None,
                    "n_read": n_read,
                }
                goals.append(new_goal)
    return goals
