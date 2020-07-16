from backend import db
from backend.model.schema import Collection


def handle_recent_10(book, collection):
    print("handling")
    reader = collection.reader

    recently_read = Collection.query.filter_by(
        reader_id=reader.id, name="Recently Read"
    ).first()

    if len(recently_read.books) < 10:
        recently_read.books.append(book)
        db.session.add(recently_read)
        db.session.commit()
        return

    memberships = sorted(recently_read.book_memberships, key=lambda mem: mem.date_added)
    oldest_book = memberships[0].book
    recently_read.books.remove(oldest_book)
    recently_read.books.append(book)
    db.session.add(recently_read)
    db.session.commit()
