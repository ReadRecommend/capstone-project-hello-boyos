import React, { Component } from "react";
import PropTypes from "prop-types";

/*
The CollectionItem class deals with displaying the books contained within a collection.
*/
class CollectionItem extends Component {
    // Can move this to a class in css later
    getStyle = () => {
        return {
            background: "#f4f4f4",
            textAlign: "center",
            padding: "10px",
            borderBottom: "1px #ccc dotted"
        }
    }

    /* 
    Remove button checks for the validity of a book before rendering the button that allows the user
    to remove the book from a collection.
    */
    removeButton = () => {
        const { book } = this.props;
        if (this !== null && typeof this !== 'undefined') {
            return <button onClick={this.props.removeBook.bind(book, book.isbn)} style={removeButton}>x</button>
        }
    }

    render() {
        const { title, summary, cover } = this.props.book;
        return (
            <div style={this.getStyle()}>
                <h1>{title + " "}{this.removeButton()}</h1>
                <img src={cover} alt={title} />
                <p>{summary}</p>
            </div>
        )
    }
}

const removeButton = {
    background: "red",
    textAlign: "right"
}

CollectionItem.propTypes = {
    book: PropTypes.object.isRequired,
    removeBook: PropTypes.func.isRequired
}

export default CollectionItem;