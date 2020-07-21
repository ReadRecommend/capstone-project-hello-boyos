from backend.model.schema import Collection


def get_recently_read(reader):
    """Get the 10 books added most recently to any of a reader's collections

    Args:
        reader (Reader): The reader whose collections to aggregate

    Returns:
        Collection: A collection named 'Recently Read' with the 10 most recent books inside
    """
    all_books = sort_books(reader, reverse=True)
    recent_books = all_books[:10]

    return Collection(books=recent_books, name="Recently Read", reader=reader,)


def get_all_books(reader):
    """Get all the books contained across all a reader's collections

    Args:
        reader (Reader): The reader whose collections to aggregate

    Returns:
        Collection: A collection named 'All' containing all books from all of the
        reader's collections sorted by date added (descending)
    """
    # Get all books sorted by title
    all_books = sort_books(reader, sort_func=lambda membership: membership.book.title)

    return Collection(books=all_books, name="All", reader=reader,)


def sort_books(
    reader, sort_func=lambda membership: membership.date_added, reverse=False
):
    """Get all the books in all a user's collections, sorted by date added (descending)

    Args:
        reader (Reader): The reader who's books to sort
        sort_func (callable, optional): A sorting function accepted as a key by `sorted`.
            Should act on a BookMembership. Defaults to sorting by date added
        reverse (bool, optional): Whether to reverse the list before returning it.
            Defaults to False

    Returns:
        List[Book]: All books across all a reader's collections, sorted by date added
    """
    # Flatten nested list of collection memberships from all collections into single list
    memberships = [
        membership
        for collection in reader.collections
        for membership in collection.book_memberships
    ]

    sorted_memberships = sorted(memberships, key=sort_func, reverse=reverse)
    return [membership.book for membership in sorted_memberships]
