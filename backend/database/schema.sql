DROP TABLE IF EXISTS Books;

CREATE TABLE Books (
    isbn text,
    title text,
    author text,
    -- More attributes to come!
    primary key(isbn)
);