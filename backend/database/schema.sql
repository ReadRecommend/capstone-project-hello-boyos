DROP TABLE IF EXISTS Books CASCADE;
DROP TABLE IF EXISTS Genres CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Collections CASCADE;
DROP TABLE IF EXISTS Reviews CASCADE;



CREATE TABLE Books (
    isbn text,
    title text,
    author text,
    summary text,
    -- More attributes to come!
    primary key(isbn)
);

CREATE TABLE Genres (
    genreName text,
    bookisbn text,
    primary key(genreName, bookisbn)
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
    ownerid integer,
    bookisbn text,
    -- More attributes to come!
    primary key(id)
    -- FOREIGN KEY (ownerid) REFERENCES Users(id),
    -- FOREIGN KEY (bookisbn) REFERENCES Books(isbn)
);

CREATE TABLE Reviews (
    id integer,
    ownerid integer,
    bookisbn text,
    -- More attributes to come!
    primary key(id)
    -- FOREIGN KEY (ownerid) REFERENCES Users(id),
    -- FOREIGN KEY (bookisbn) REFERENCES Books(isbn)
);