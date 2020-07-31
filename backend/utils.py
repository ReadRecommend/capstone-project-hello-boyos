from backend.errors import InvalidRequest


def extract_integers(data, variable_names, default_value=None, required=True):
    integers = []

    for variable in variable_names:
        integers.append(
            extract_integer(
                data, variable, default_value=default_value, required=required
            )
        )

    return integers


def extract_integer(data, variable_name, default_value=None, required=True):
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
