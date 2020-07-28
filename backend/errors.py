from http import HTTPStatus

from flask import jsonify
from flask_buzz import FlaskBuzz

from backend import app


class InvalidRequest(FlaskBuzz):
    status_code = status_code = HTTPStatus.BAD_REQUEST


app.register_error_handler(
    InvalidRequest, InvalidRequest.build_error_handler(),
)


class AuthenticationError(FlaskBuzz):
    status_code = status_code = HTTPStatus.FORBIDDEN


app.register_error_handler(
    AuthenticationError, AuthenticationError.build_error_handler(),
)


class ResourceExists(FlaskBuzz):
    status_code = status_code = HTTPStatus.FORBIDDEN


app.register_error_handler(ResourceExists, ResourceExists.build_error_handler())


class ResourceNotFound(FlaskBuzz):
    status_code = status_code = HTTPStatus.NOT_FOUND


app.register_error_handler(ResourceNotFound, ResourceNotFound.build_error_handler())


class ForbiddenResource(FlaskBuzz):
    status_code = status_code = HTTPStatus.FORBIDDEN


app.register_error_handler(ForbiddenResource, ForbiddenResource.build_error_handler())


@app.errorhandler(404)
def not_found(e):
    error, message = str(e).split(":")
    return (
        jsonify(error=error, message=message, status_code=404),
        404,
    )
