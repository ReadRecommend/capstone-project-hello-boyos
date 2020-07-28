from backend.errors import InvalidRequest


def validate_id(id, id_name):
    """Validate a given id is acceptable

    Args:
        id (str): The id to validate
        id_name (str): The name of the id, used for error messages

    Raises:
        InvalidRequest: if id is None
        InvalidRequest: if the id is not parseable as an integer

    Returns:
        [type]: [description]
    """
    if not id:
        raise InvalidRequest(f"{id} is a required field")
    try:
        return int(id)
    except:
        raise InvalidRequest(f"{id_name} should be parseable as an integer")
