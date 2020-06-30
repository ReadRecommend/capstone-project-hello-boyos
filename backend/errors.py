from flask_buzz import FlaskBuzz
from http import HTTPStatus
from backend import app


class InvalidRequest(FlaskBuzz):
    status_code = status_code = HTTPStatus.BAD_REQUEST


app.register_error_handler(
    InvalidRequest, InvalidRequest.build_error_handler(),
)


class AuthenticationError(FlaskBuzz):
    status_code = status_code = HTTPStatus.UNAUTHORIZED


app.register_error_handler(
    AuthenticationError, AuthenticationError.build_error_handler(),
)


class ResourceExists(FlaskBuzz):
    status_code = status_code = HTTPStatus.FORBIDDEN


app.register_error_handler(ResourceExists, ResourceExists.build_error_handler())
