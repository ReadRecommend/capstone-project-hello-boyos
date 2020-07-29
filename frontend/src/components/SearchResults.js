import React, { Component } from "react";
import { CardDeck } from "react-bootstrap";
import BookCard from "../components/BookCard.js";

class SearchResults extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <CardDeck>
                    {this.props.books.map((book) => (
                        <BookCard key={book.id} book={book} editable="false" />
                    ))}
                </CardDeck>
            </div>
        );
    }
}

export default SearchResults;