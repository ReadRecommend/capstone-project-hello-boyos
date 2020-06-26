import React, { Component } from "react";
import CollectionItem from "./CollectionItem";
import PropTypes from "prop-types";

class Collection extends Component {
    render() {
        return this.props.currentCollection.map((book) => (
            <CollectionItem key={book.isbn} book={book} />
        ));
    }
}

Collection.propTypes = {
    currentCollection: PropTypes.array.isRequired
}

export default Collection;