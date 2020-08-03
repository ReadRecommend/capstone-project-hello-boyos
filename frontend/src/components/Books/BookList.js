import React, { Component } from "react";
import { CardDeck } from "react-bootstrap";
import BookCard from "./BookCard.js";

class BookList extends Component {
    render() {
        return (
            <div>
                <CardDeck>
                    {this.props.books.map((book) => (
                        <BookCard key={book.id} book={book} editable={false} />
                    ))}
                </CardDeck>
            </div>
        );
    }
}

export default BookList;
