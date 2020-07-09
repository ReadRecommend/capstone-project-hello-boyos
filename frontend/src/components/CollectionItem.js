import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

/*
The CollectionItem class deals with displaying the books contained within a collection.
*/
class CollectionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
        };
    }

    displayCollections = () => {
        const { isbn } = this.props.book;
        console.log("User Collections 2: " + this.props.userCollections);
        return this.props.userCollections.map((collection) => (
            <div key={collection.id}>
                <button
                    onClick={this.props.addToCollection.bind(
                        this,
                        isbn,
                        collection.id
                    )}
                >
                    {collection.name}
                </button>
            </div>
        ));
    };

    // Can move this to a class in css later
    getStyle = () => {
        return {
            background: "#f4f4f4",
            textAlign: "center",
            padding: "10px",
            borderBottom: "1px #ccc dotted",
        };
    };

    handleModal = () => {
        if (this !== null && typeof this !== "undefined") {
            this.setState({ modalShow: !this.state.modalShow });
        }
    };

    addButton = () => {
        console.log("User Collections 1: " + this.props.userCollections);
        if (
            this.props.book !== null &&
            typeof this.props.book !== "undefined" &&
            this.props.editable === true
        ) {
            return (
                <button onClick={this.handleModal} style={addButton}>
                    +
                </button>
            );
        }
    };

    /* 
    Remove button checks for the validity of a book before rendering the button that allows the user
    to remove the book from a collection.
    */
    removeButton = () => {
        const { book } = this.props;
        if (
            this !== null &&
            typeof this !== "undefined" &&
            this.props.editable === true
        ) {
            return (
                <button
                    onClick={this.props.removeBook.bind(book, book.isbn)}
                    style={removeButton}
                >
                    x
                </button>
            );
        }
    };

    render() {
        const { title, summary, cover } = this.props.book;
        return (
            <div style={this.getStyle()}>
                {this.props.editable === true && (
                    <Modal show={this.state.modalShow}>
                        <Modal.Header>
                            <Modal.Title>Add to a Collection</Modal.Title>
                            <button
                                onClick={() => {
                                    this.handleModal();
                                }}
                            >
                                x
                            </button>
                        </Modal.Header>
                        <Modal.Body>{this.displayCollections()}</Modal.Body>
                        <Modal.Footer></Modal.Footer>
                    </Modal>
                )}

                <h1>
                    {this.addButton()}
                    {title + " "}
                    {this.removeButton()}
                </h1>
                <a href={`/book/${this.props.book.isbn}`}>
                    <img src={cover} alt={title} />
                </a>
                <p>{summary}</p>
            </div>
        );
    }
}

const removeButton = {
    background: "red",
    textAlign: "right",
};

const addButton = {
    background: "green",
    textAlign: "left",
};

CollectionItem.propTypes = {
    book: PropTypes.object.isRequired,
    userCollections: PropTypes.array.isRequired,
};

export default CollectionItem;
