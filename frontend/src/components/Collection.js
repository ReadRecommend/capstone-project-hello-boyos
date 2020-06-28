import React, { Component } from "react";
import CollectionItem from "./CollectionItem";
import PropTypes from "prop-types";

class Collection extends Component {

    isValid = () => {
        const { currentCollection } = this.props;
        if (currentCollection !== null && typeof currentCollection.books !== 'undefined') {
            return currentCollection.books.map((book) => (<CollectionItem key={book.isbn} book={book} />))
        } else {
            return (
                <div>
                    <p>
                        No Collection Selected.
                    </p>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <h2>{this.id}</h2>
                {console.log("Name is: " + this.props.currentCollection.name)}
                {this.isValid()}
            </div>

        );
    }
}

Collection.propTypes = {
    currentCollection: PropTypes.object.isRequired
}

export default Collection;