from backend.errors import InvalidRequest, ResourceExists
from backend.model.schema import Book
import isbnlib


def validate_book_data(book_data):
    """Checks to see if the given book data is valid

    Args:
        book_data (dict): The book data to validate. Required keys are 'isbn', 'title', and 'authors'

    Raises:
        InvalidRequest: If 'isbn', 'title', and 'authors' do not appear as keys in book_data
        InvalidRequest: If the value for key 'authors' is not a list of strings
        InvalidRequest: If the isbn is not valid. See https://en.wikipedia.org/wiki/International_Standard_Book_Number#Check_digits
        ResourceExists: If a book with the provided isbn already exists

    Returns:
        dict: The validated book data
    """
    isbn = book_data.get("isbn")
    title = book_data.get("title")
    authors = book_data.get("authors")

    # Ensure request is valid format
    if not (title and isbn and authors):
        raise InvalidRequest(
            "Request should be of the form {{isbn: 'isbn', title: 'title', authors: [author1, author2,]}}"
        )

    # Check if isbn is valid
    if not (isbn := isbnlib.to_isbn13(isbnlib.clean(isbn))):
        raise InvalidRequest(
            "The isbn provided is not valid or could not be converted into isbn-13 format"
        )
    # If valid, replace provided isbn with cleaned and verified isbn
    book_data["isbn"] = isbn

    # Check if a Book with this isbn already exists
    if Book.query.filter((Book.isbn == isbn)).first():
        raise ResourceExists("A book with this isbn already exists")

    if not all(isinstance(author_name, str) for author_name in authors):
        raise InvalidRequest(
            "Request should be of the form {{isbn: 'isbn', title: 'title', authors: [author1, author2,]}}"
        )

    return book_data
