import json

f = open("books.json", "r")

data = json.load(f)
dummyID = 1
bookSqlStatements = []
genreSqlStatements = []
for book in data:
    if (not "isbn" in book):
        # If it doesnt have a ISBN give it a dummy one
        isbn = str(dummyID)
        dummyID += 1
    else:
        isbn = book["isbn"]

    if (not "description" in book):
        # Some dont have a description
        description = ""
    else:
        description = book["description"]
    
    # Escape the single quotes for the SQL statement
    title = book["title"].replace("'", "''")
    author = book["authors"][0].replace("'", "''")
    description = description.replace("'", "''")

    # Create the sql statements for the book
    bookSqlStatement = "INSERT INTO Books VALUES ('{ISBN}', '{title}', '{author}', '{summary}');\n".format(ISBN = isbn, title = title, author = author, summary=description)
    bookSqlStatements.append(bookSqlStatement)

    if ("genres" in book):
        # If it has genres
        # For some reason there was duplicate genres sometimes so it has to be turned into a set
        genres = set(book["genres"])
        for genre in genres:
            # Escape the single quotes for the SQL statement
            genre = genre.replace("'", "''")

            # Create the sql statements for the book + genre combo
            genreSqlStatement = "INSERT INTO Genres VALUES ('{g}', '{ISBN}');\n".format(g = genre, ISBN = isbn)
            genreSqlStatements.append(genreSqlStatement)

outfile = open("data.sql", "w", encoding="utf-8")
outfile.write("-- Books\n")
for book in bookSqlStatements:
    outfile.write(book)

outfile.write("\n")
outfile.write("-- Genres\n")
for genre in genreSqlStatements:
    outfile.write(genre)