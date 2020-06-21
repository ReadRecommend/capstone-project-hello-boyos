import requests
from bs4 import BeautifulSoup
import json
from tqdm import tqdm
import sys
import argparse
from multiprocessing import Pool


def strip_book(url):
    """Given the url to a Goodreads book, will return a dictionary of that books key information

    Args:
        url (str): The url to the Goodreads book

    Returns:
        dict: dictionary of key book information including title, authors, description,
         genres, isbn, language, average rating, and number of reviews
    """

    # Read in the book page HTML
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")

    book = {}

    # Get the title of the book
    book["title"] = soup.find(id="bookTitle").text.strip()

    # Clean and add the list of authors to the dictionary
    author_list = (
        soup.find(id="bookAuthors")
        .text.split("by")[1]
        .replace("(Goodreads Author)", "")
        .split(",")
    )
    book["authors"] = [author.strip() for author in author_list]

    # For the following, check if the element exists, and if so add it to the dictionary
    if (isbn_element := soup.find(itemprop="isbn")) :
        book["isbn"] = isbn_element.text.strip()
    else:
        book["isbn"] = None

    if (genres := soup.find_all(class_="actionLinkLite bookPageGenreLink")) :
        book["genres"] = [genre.text.strip() for genre in genres]
    else:
        book["genres"] = None

    if (language_element := soup.find(itemprop="inLanguage")) :
        book["language"] = language_element.text.strip()
    else:
        book["language"] = None

    if (rating_element := soup.find(itemprop="ratingValue")) :
        book["rating"] = float(rating_element.text.strip())
    else:
        book[""] = None

    if (reviews_element := soup.find(itemprop="reviewCount")) :
        book["n_reviews"] = int(
            reviews_element.text.split("reviews")[0].strip().replace(",", "")
        )
    else:
        book["n_reviews"] = None

    if (image_element := soup.find(id="coverImage")) :
        book["image_url"] = image_element["src"]
    else:
        book["image_url"] = None

    book_details = soup.find(id="details").text
    if "first published" in book_details:
        date_string = (
            book_details.split("first published ")[1]
            .split(")")[0]
            .strip()
            .split(" ")[-1]
        )
        book["publication_year"] = date_string
    elif "Published" in book_details:
        date_string = (
            book_details.split("Published")[1].split("by")[0].strip().split(" ")[-1]
        )
        book["publication_year"] = date_string
    else:
        book["publication_year"] = None

    try:
        if (publisher_string := book_details.split("by")[1].split("\n")[0].strip()) :
            book["publisher"] = publisher_string
    except:
        book["publisher"] = None

    # If a book's description is long it will be hidden, otherwise just grab the text
    descrFind = soup.find(id="description")
    if descrFind and descrFind.find(style="display:none"):
        book["description"] = descrFind.find(style="display:none").text.strip()
    elif descrFind:
        book["description"] = descrFind.text.strip()

    return book


if __name__ == "__main__":
    # Configure command line arguments
    parser = argparse.ArgumentParser(
        description="Scrape book details from Goodreads. Note for large numbers of books things may fail"
    )
    parser.add_argument(
        "-b",
        "--books",
        metavar="books",
        type=int,
        help="The amount of books desired. Default: 500",
        default=500,
    )

    parser.add_argument(
        "-l",
        "--list",
        metavar="list",
        type=str,
        nargs="?",
        help="The url of the Goodreads list to scrape.\nDefault: https://www.goodreads.com/list/show/1.Best_Books_Ever",
        default="https://www.goodreads.com/list/show/1.Best_Books_Ever",
    )
    parser.add_argument(
        "-o",
        "--out",
        nargs="?",
        type=str,
        metavar="outfile",
        default="books.json",
        help="The filepath to save the scraped books. Default: books.json",
    )
    parser.add_argument(
        "-t",
        "--threads",
        nargs="?",
        type=int,
        metavar="threads",
        default=8,
        help="The number of threads to use when scraping. Default: 8",
    )

    args = parser.parse_args()

    # Start of scraping script
    results = []
    n_books = args.books
    n_pages = int((n_books - 1) / 100) + 1
    list_url = args.list

    # Process pool for parallel scraping
    # Should not create more threads than books
    threads = min([n_books - 1, args.threads])
    pool = Pool(threads)

    # Setup progress bar
    page_pbar = tqdm(total=n_pages, unit="page", ncols=100, file=sys.stdout)
    for page_no in range(1, n_pages + 1):
        page_pbar.set_description(f"Scraping page {page_no}")
        page_pbar.update(1)
        # Calculate limit if n_books does not equal a whole number of pages.
        # Will only be < 100 on final page
        if (page_no == n_pages) and (n_books % 100) != 0:
            limit = n_books % 100
        else:
            limit = 100

        # Get the url for the current page of the list
        url = f"{list_url}?page={page_no}"

        # Read in the page HTML
        page = requests.get(url)
        soup = BeautifulSoup(page.content, "html.parser")

        # Create list of up to `limit` book urls/titles to scrape
        bookFind = soup.find_all("a", class_="bookTitle", limit=limit)
        book_urls = [f"https://www.goodreads.com{book['href']}" for book in bookFind]

        pbar = tqdm(
            pool.imap_unordered(strip_book, book_urls),
            total=limit,
            unit="book",
            ncols=100,
            file=sys.stdout,
        )
        for result in pbar:
            pbar.set_description(f"Scraping books from page {page_no}")
            pbar.update(1)
            results.append(result)

    # Close the process pool
    pool.close()
    pool.join()

    with open(args.out, "w") as f:
        json.dump(results, f, indent=2)
