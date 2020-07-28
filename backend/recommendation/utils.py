from backend.errors import InvalidRequest


def validate_integer(variable, variable_name):
    """Validate a given variable is acceptable as required int

    Args:
        variable (str): The variable to validate
        variable_name (str): The name of the variable, used for error messages

    Raises:
        InvalidRequest: if variable is None
        InvalidRequest: if the variable is not parseable as an integer

    Returns:
        [type]: [description]
    """
    if not variable:
        raise InvalidRequest(f"{variable_name} is a required field")
    try:
        return int(variable)
    except:
        raise InvalidRequest(f"{variable_name} should be parseable as an integer")
