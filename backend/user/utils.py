from backend.model.schema import Collection


def get_recently_read(reader):
    """Get the 10 books added most recently to any of a reader's collections

    Args:
        reader (Reader): The reader whose collections to aggregate

    Returns:
        Collection: A collection named 'Recently Read' with the 10 most recent books inside
    """
    all_books = get_all_books(
        reader, sort_func=lambda membership: membership.date_added, reverse=True
    )
    recent_books = all_books[:10]

    return Collection(books=recent_books, name="Recently Read", reader=reader,)


def get_all_books(reader, sort_func=None, reverse=False):
    """Get all the books in all a user's collections

    Args:
        reader (Reader): The reader who's books to sort
        sort_func (callable, optional): A sorting function accepted as a key by `sorted`.
            Should act on a BookMembership. Defaults to unsorted
        reverse (bool, optional): Whether to reverse the sort order. Only used if sort_func
            is not provided. Defaults to False

    Returns:
        List[Book]: All books across all a reader's collections, sorted by date added
    """
    # Flatten nested list of collection memberships from all collections into single list
    memberships = [
        membership
        for collection in reader.collections
        for membership in collection.book_memberships
    ]
    if sort_func:
        memberships = sorted(memberships, key=sort_func, reverse=reverse)

    # Need to only include each book a maximum of once, even if it is in multiple collections
    unique_book_memberships = []
    for membership in memberships:
        # Check if the book id has already been added to the unique book memberships
        if not membership.book_id in [mem.book_id for mem in unique_book_memberships]:
            unique_book_memberships.append(membership)

    return [membership.book for membership in unique_book_memberships]
