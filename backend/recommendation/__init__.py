from flask import Blueprint

recommendation_bp = Blueprint("recommendation", __name__, url_prefix="/recommendations")

# Multiple of the number of recommendations desired to sample from
# e.g. if 6 recommendations are asked for, randomly sample 6 times
# from the top 6 * POOL_SIZE recommendations
POOL_SIZE = 3

# The default number of books to recommend
DEFAULT_NRECOMMEND = 10

from backend.recommendation import routes
