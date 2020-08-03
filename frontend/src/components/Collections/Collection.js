import React, { Component } from "react";
import PropTypes from "prop-types";
import { CardDeck } from "react-bootstrap";

import BookCard from "../Books/BookCard";

/*
The collection contains collection-items, which themselves contain books to be
displayed.
This class deals with displaying those collection items.
*/
class Collection extends Component {
    displayCollection = () => {
        const { currentCollection } = this.props;
        if (
            currentCollection !== null &&
            typeof currentCollection.books !== "undefined"
        ) {
            return (
                <CardDeck>
                    {currentCollection.books.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            removeBook={this.props.removeBook}
                            addToCollection={this.props.addToCollection}
                            userCollections={this.props.userCollections}
                            editable={this.props.editable}
                        />
                    ))}
                </CardDeck>
            );
        }
    };

    render() {
        return <div>{this.displayCollection()}</div>;
    }
}

Collection.propTypes = {
    currentCollection: PropTypes.object.isRequired,
};

export default Collection;
