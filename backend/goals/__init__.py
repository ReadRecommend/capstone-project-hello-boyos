from flask import Blueprint

goals_bp = Blueprint("goals", __name__, url_prefix="/goals")

from backend.goals import routes
