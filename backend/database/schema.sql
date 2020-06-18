DROP TABLE IF EXISTS Books CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Collections CASCADE;
DROP TABLE IF EXISTS Reviews CASCADE;



CREATE TABLE Books (
    isbn text,
    title text,
    author text,
    -- More attributes to come!
    primary key(isbn)
);

-- Function for table in base.py
-- CREATE TABLE below causes base.py to be unable to insert
-- users with null ID, which would be assigned automatically...
-- the same may occur with the tables below...
-- CREATE TABLE Users (
--     id integer,
--     username text,
--     email text,
--     -- More attributes to come!
--     primary key(id)
-- );

CREATE TABLE Collections (
    id integer,
    name text,
    ownerID integer,
    bookISBN text,
    -- More attributes to come!
    primary key(id)
    -- FOREIGN KEY (ownerID) REFERENCES Users(id),
    -- FOREIGN KEY (bookISBN) REFERENCES Books(isbn)
);

CREATE TABLE Reviews (
    id integer,
    ownerID integer,
    bookISBN text,
    -- More attributes to come!
    primary key(id)
    -- FOREIGN KEY (ownerID) REFERENCES Users(id),
    -- FOREIGN KEY (BookISBN) REFERENCES Books(isbn)
);