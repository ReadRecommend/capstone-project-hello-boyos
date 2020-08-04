import numpy as np
from backend.user.utils import get_all_books
from backend.recommendation import POOL_SIZE, DEFAULT_NRECOMMEND
from random import sample
from backend.model.schema import Reader
from backend.errors import ResourceNotFound


def remove_reader_overlap(reader_id, book_list):
    reader = Reader.query.filter_by(id=reader_id).first()
    if not reader:
        raise ResourceNotFound("A user with the specified ID does not exist")
    reader_books = get_all_books(reader)
    return list(set(book_list) - set(reader_books))


def sample_top_books(book_list, n_recommend=DEFAULT_NRECOMMEND):
    sorted_books = sorted(book_list, key=weighted_rating, reverse=True)
    top_books = sorted_books[: POOL_SIZE * n_recommend]
    return sample(top_books, min(n_recommend, len(top_books)))


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
