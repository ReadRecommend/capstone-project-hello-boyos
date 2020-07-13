import React, { Component, useState } from "react";
import { getBook, addToCollection, verifyUser } from "../fetchFunctions";
import { Modal, Button, Form, Toast } from "react-bootstrap";
import PropTypes from "prop-types";

class AddBookModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            collectionID: null,
        };
    }

    showModal = () => {
        this.setState({ show: true });
    };
    hideModal = () => {
        this.setState({ show: false });
    };

    handleChange = (e) => {
        console.log(e.target.value);
        this.setState({ collectionID: e.target.value });
    };

    render() {
        const { book, user } = this.props;
        if (!user) {
            return null;
        }
        return (
            <>
                <Button
                    variant="primary"
                    onClick={() => {
                        this.showModal();
                        this.setState({ collectionID: user.collections[0].id });
                    }}
                >
                    Add to Collection
                </Button>
                <Modal show={this.state.show} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add {book.title} to a collection?
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Select a collection to add this book to:</p>
                        <Form.Control as="select" onChange={this.handleChange}>
                            {user.collections &&
                                user.collections.map((collection) => {
                                    return (
                                        <option value={collection.id}>
                                            {collection.name}
                                        </option>
                                    );
                                })}
                        </Form.Control>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                addToCollection(
                                    book.isbn,
                                    this.state.collectionID
                                );
                                this.hideModal();
                                this.props.notify(
                                    `Successfully added ${book.title} to your collection`
                                );
                            }}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default AddBookModal;

AddBookModal.propTypes = {
    book: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
};
