import json

f = open("books.json", "r")

data = json.load(f)
dummyID = 1
bookSqlStatements = []
authorSqlStatements = []
genreSqlStatements = []
for book in data:
    # Check for nulls
    if book["isbn"] == None:
        # If it doesnt have a ISBN give it a dummy one
        isbn = str(dummyID)
        dummyID += 1
    else:
        isbn = book["isbn"]

    if book["publication_year"] == None:
        publication_year = "NULL"
    else:
        publication_year = book["publication_year"]

    if book["publisher"] == None:
        publisher = "NULL"
    else:
        publisher = book["publisher"]

    if book["image_url"] == None:
        image = "NULL"
    else:
        image = book["image_url"]

    if "description" not in book or book["description"] == None:
        description = "NULL"
    else:
        description = book["description"]

    # Escape the single quotes for the SQL statement
    title = book["title"].replace("'", "''")
    language = book["language"].replace("'", "''")
    rating = 0
    image = image.replace("'", "''")
    publication_year = publication_year.replace("'", "''")
    publisher = publisher.replace("'", "''")
    description = description.replace("'", "''")
    description = description.replace("\n", " ")

    # Add the single quotes if not NULL
    if publisher != "NULL":
        publisher = "'" + publisher + "'"
    if image != "NULL":
        image = "'" + image + "'"
    if description != "NULL":
        description = "'" + description + "'"

    # Create the sql statements for the book
    bookSqlStatement = "INSERT INTO Books VALUES ('{ISBN}', '{title}', {publisher}, {publicationdate}, '{language}', {cover}, {summary});\n".format(
        ISBN=isbn,
        title=title,
        publisher=publisher,
        publicationdate=publication_year,
        language=language,
        cover=image,
        summary=description,
    )
    bookSqlStatements.append(bookSqlStatement)

    # Create author table sql statements
    # For some reason there was duplicate authors sometimes so it has to be turned into a set
    authors = set(book["authors"])
    for author in authors:
        # Escape the single quotes for the SQL statement
        author = author.replace("'", "''")

        # Create the sql statements for the book + author combo
        authorSqlStatement = "INSERT INTO Authors VALUES ('{author}', '{bookisbn}');\n".format(
            author=author, bookisbn=isbn
        )
        authorSqlStatements.append(authorSqlStatement)

    # Create genre table sql statements
    # For some reason there was duplicate genres sometimes so it has to be turned into a set
    genres = set(book["genres"])
    for genre in genres:
        # Escape the single quotes for the SQL statement
        genre = genre.replace("'", "''")

        # Create the sql statements for the book + genre combo
        genreSqlStatement = "INSERT INTO Genres VALUES ('{ISBN}', '{g}');\n".format(
            ISBN=isbn, g=genre
        )
        genreSqlStatements.append(genreSqlStatement)

# Write the create sql statements to files
outfile = open("data.sql", "w", encoding="utf-8")
for book in bookSqlStatements:
    outfile.write(book)

outfile.write("\n")
for author in authorSqlStatements:
    outfile.write(author)

outfile.write("\n")
for genre in genreSqlStatements:
    outfile.write(genre)
