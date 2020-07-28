from backend.errors import InvalidRequest
import numpy as np


def validate_integer(variable, variable_name):
    """Validate a given variable is acceptable as required int

    Args:
        variable (str): The variable to validate
        variable_name (str): The name of the variable, used for error messages

    Raises:
        InvalidRequest: if variable is None
        InvalidRequest: if the variable is not parseable as an integer

    Returns:
        int: the variable if it can successfully be cast to an integer
    """
    if not variable:
        message = f"{variable_name} is a required field"
        raise InvalidRequest(message)
    try:
        return int(variable)
    except:
        message = f"{variable_name} should be parseable as an integer"
        raise InvalidRequest(message)


def weighted_rating(book, Q=3000):
    """Weight a books average rating by the number of reviews it has

    Args:
        book (Book): The book to score
        Q (int, optional): The weighting factor of more reviews. For larger Q, each 
        individual review is weighted less. Good estimate can be found as M/ln(2),
        where M is a 'moderate' amount of ratings. Defaults to 3000.
    """
    score = (book.ave_rating / 2) + (5 / 2) * (1 - np.exp(-book.n_ratings / Q))
    return score

