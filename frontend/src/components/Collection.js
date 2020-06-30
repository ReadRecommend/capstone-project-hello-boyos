import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CollectionItem from './CollectionItem';
import LoadingSpinner from '../components/LoadingSpinner';

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
                />
            ))
        }
    }

    render() {
        return (
            <div style={collectionStyle}>
                <LoadingSpinner area="collection-view" />
                {this.displayCollection()}
            </div >
        );
    }
}

const collectionStyle = {
    textAlign: "center"
}

Collection.propTypes = {
    currentCollection: PropTypes.object.isRequired,
    removeBook: PropTypes.func.isRequired,
    addToCollection: PropTypes.func.isRequired,
    userCollections: PropTypes.array.isRequired
}

export default Collection;