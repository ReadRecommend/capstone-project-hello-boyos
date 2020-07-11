import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Card, Button, ListGroup, ListGroupItem } from "react-bootstrap";

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
        return (
            <ListGroup variant="flush">
                {this.props.userCollections.map((collection) => (
                    <ListGroupItem
                        action
                        key={collection.id}
                        onClick={this.props.addToCollection.bind(
                            this,
                            isbn,
                            collection.id
                        )}
                    >
                        {collection.name}
                    </ListGroupItem>
                ))}
            </ListGroup>
        );
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
        if (
            this.props.book !== null &&
            typeof this.props.book !== "undefined" &&
            this.props.editable === true
        ) {
            return (
                <Button
                    variant="success"
                    className="float-left"
                    size="sm"
                    onClick={this.handleModal}
                >
                    +
                </Button>
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
                <Button
                    variant="danger"
                    className="float-right"
                    size="sm"
                    onClick={this.props.removeBook.bind(book, book.isbn)}
                >
                    x
                </Button>
            );
        }
    };

    render() {
        const { title, cover, isbn } = this.props.book;
        return (
            <div>
                {this.props.editable === true && (
                    <Modal
                        show={this.state.modalShow}
                        onHide={this.handleModal}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Add to a Collection</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>{this.displayCollections()}</Modal.Body>
                        <Modal.Footer></Modal.Footer>
                    </Modal>
                )}
                <Card style={{ width: "314px" }}>
                    <a href={`/book/${isbn}`}>
                        <Card.Img variant="top" src={cover} height="475px" />
                    </a>
                    <Card.Body>
                        <Card.Text>
                            <a href={`/book/${isbn}`}>{title}</a>
                        </Card.Text>
                        <Card.Text>
                            {this.addButton()}
                            {this.removeButton()}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

CollectionItem.propTypes = {
    book: PropTypes.object.isRequired,
    userCollections: PropTypes.array.isRequired,
};

export default CollectionItem;
