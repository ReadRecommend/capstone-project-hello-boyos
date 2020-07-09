import React, { Component } from "react";
import CollectionItem from "./CollectionItem";
import PropTypes from "prop-types";

/*
The collection contains collection-items, which themselves contain books to be
displayed.
This class deals with displaying those collection items.
*/
class Collection extends Component {

    displayCollection = () => {
        const { currentCollection } = this.props;
        if (currentCollection !== null && typeof currentCollection.books !== 'undefined') {
            return currentCollection.books.map((book) => (
                <CollectionItem
                    key={book.isbn}
                    book={book}
                    removeBook={this.props.removeBook}
                    addToCollection={this.props.addToCollection}
                    userCollections={this.props.userCollections}
                    editable={this.props.editable}
                />
            ))
        }
    }

    render() {
        return (
            <div>
                {this.displayCollection()}
            </div>
        );
    }
}

Collection.propTypes = {
    currentCollection: PropTypes.object.isRequired,
}

export default Collection;