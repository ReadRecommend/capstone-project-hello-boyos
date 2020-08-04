from backend.errors import InvalidRequest


def extract_integers(data, variable_names, default_value=None, required=True):
    """Extracts a number of integer variables from a dictionary

    Args:
        data (dict): The dictionary containing the data to extract
        variable_names (List[str]): The list of keys expected in the dictionary
        default_value (int, optional): If supplied this value will be used for all keys that don't exist. 
            required is not used if this is supplied. Defaults to None.
        required (bool, optional): Whether or not to raise an error if all variable names are not keys. Defaults to True.

    Returns:
        List[int]: The list of extracted integers
    """
    integers = []

    for variable in variable_names:
        integers.append(
            extract_integer(
                data, variable, default_value=default_value, required=required
            )
        )

    return integers


def extract_integer(data, variable_name, default_value=None, required=True):
    """Extract an integer variable from a dictionary

    Args:
        data (dict): The dictionary containing the data to extract
        variable_name (str): The key corresponding to the data in the dictionary
        default_value (int, optional): If supplied this value will be used if the key does not exist. Defaults to None.
        required (bool, optional): Whether or not to raise an error if variable_name is not a key. Defaults to True.

    Raises:
        InvalidRequest: If required=True and the key does not exist in the dictionary
        InvalidRequest: If the key exists, but the data cannot be parsed as an integer

    Returns:
        int: The extracted integer
    """
    variable = data.get(variable_name, default_value)
    if variable is None:
        if required:
            message = f"{variable_name} is a required field"
            raise InvalidRequest(message)
        else:
            return variable
    try:
        int_variable = int(variable)
    except (ValueError, TypeError):
        message = f"{variable_name} should be parseable as an integer"
        raise InvalidRequest(message)
    return int_variable
