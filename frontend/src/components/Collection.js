import React, { Component } from "react";
import CollectionItem from "./CollectionItem";
import PropTypes from "prop-types";

class Collection extends Component {
    render() {
        return (
            <div>
                <h2>{this.id}</h2>
                {console.log(this.name)}
                {this.props.currentCollection.books.map((book) => (<CollectionItem key={book.isbn} book={book} />))}
            </div>

        );
    }
}

Collection.propTypes = {
    currentCollection: PropTypes.object.isRequired
}

export default Collection;