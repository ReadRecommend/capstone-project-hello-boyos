from flask import Blueprint

collection_bp = Blueprint("collection", __name__, url_prefix="/collection")

from backend.collection import routes
