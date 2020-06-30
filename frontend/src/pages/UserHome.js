import React, { Component } from "react";
import { Modal, Alert, Dropdown } from "react-bootstrap";
import Collection from "../components/Collection";
import CollectionList from "../components/CollectionList/CollectionList";
import AddCollection from "../components/CollectionList/AddCollection";

class UserHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            collectionList: [],
            currentCollection: {},
            modalShow: false,
            errorGeneralShow: false,
            errorGeneralMessage: "",
            errorAddCollectionShow: false,
            errorAddCollectionMessage: "",
        };
    }

    componentDidMount() {
        // TODO Check response code and error handle. Also not hardcode url
        // Fetch the information about the logged in user
        fetch(`http://localhost:5000/user/${this.props.username}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                let collections = json.collections;
                console.log(collections);
                this.setState({ collectionList: collections, userId: json.id });
            });

        fetch("http://localhost:5000/book")
            .then((res) => {
                return res.json();
            })
            .then((books) => {
                this.setState({
                    library: books,
                });
            });
    }

    // Function that makes the modal show/not show
    handleModal() {
        this.setState({
            modalShow: !this.state.modalShow,
            errorAddCollectionShow: false,
        });
    }

    // Function that makes the general error not show
    handleGeneralError() {
        this.setState({ errorGeneralShow: false, errorGeneralMessage: "" });
    }

    // Function that makes the add collection error not show
    handleAddCollectionError() {
        this.setState({
            errorAddCollectionShow: false,
            errorAddCollectionMessage: "",
        });
    }

    // Function that deletes a collection in a user's collection list
    delCollection = (name) => {
        const data = { reader_id: this.state.userId, name: name };
        console.log(data);
        console.log("AccessToken:" + this.props.accessToken);

        // We will let the backend do the checking for us
        fetch("http://localhost:5000/collection", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.props.accessToken,
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                console.log(json);
                this.setState({ collectionList: json.collections });
            })
            .catch((error) => {
                console.log(error.message);
                this.setState({
                    errorGeneralShow: true,
                    errorGeneralMessage: error.message,
                });
            });
    };

    // Function that adds a collection to a user's collection list
    addCollection = (name) => {
        const data = { reader_id: this.state.userId, name: name };
        console.log(data);

        // We will let the backend do the checking for us
        fetch("http://localhost:5000/collection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.props.accessToken,
            },
            body: JSON.stringify(data),
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                console.log(json);
                this.setState({ collectionList: json.collections });
                this.handleModal();
            })
            .catch((error) => {
                console.log(error.message);
                this.setState({
                    errorAddCollectionShow: true,
                    errorAddCollectionMessage: error.message,
                });
            });
    };

    /*
    Remove book makes a call to the API to remove a book from the current collection
    upon the user clicking the remove book button. The new collection without the book
    is returned and set as the current collection.
    */
    removeBook = (isbn) => {
        fetch("http://localhost:5000/modify_collection", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.props.accessToken,
            },
            body: JSON.stringify({
                book_id: isbn,
                collection_id: this.state.currentCollection.id,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                this.setState({ currentCollection: json });
            });
    };

    /*
    The selectCollection function takes the id of a collection and 
    changes the state of the page and refreshes it so that the 
    selected collection can then be displayed.
    */
    selectCollection = (id) => {
        fetch(`http://localhost:5000/collection/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                this.setState({ currentCollection: json });
            });
    };

    addToCollection = (isbn, id) => {
        console.log("ISBN and Col id are: " + isbn + " and " + id);
        fetch("http://localhost:5000/modify_collection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + this.props.accessToken,
            },
            body: JSON.stringify({
                book_id: isbn,
                collection_id: id,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                this.setState({ currentCollection: json });
            });
    };

    render() {
        return (
            <div className="UserHome">
                <h3>Welcome {this.props.username} </h3>
                {/* Alert for general problems */}
                <Alert
                    show={this.state.errorGeneralShow}
                    onClose={() => this.handleGeneralError()}
                    variant="danger"
                    dismissible
                >
                    {this.state.errorGeneralMessage}
                </Alert>

                {/* Modal for creating a new collection */}
                <Modal
                    show={this.state.modalShow}
                    onHide={() => this.handleModal()}
                >
                    {/* Alert for problems with adding collections */}
                    <Alert
                        show={this.state.errorAddCollectionShow}
                        onClose={() => this.handleAddCollectionError()}
                        variant="danger"
                        dismissible
                    >
                        {this.state.errorAddCollectionMessage}
                    </Alert>

                    <Modal.Header>
                        <Modal.Title>Create New Collection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddCollection addCollection={this.addCollection} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={() => {
                                this.handleModal();
                            }}
                        >
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>

                <h4>
                    Collections
                    <button
                        onClick={() => {
                            this.handleModal();
                        }}
                    >
                        +
                    </button>
                </h4>

                <br></br>

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Choose a book to add to your collection
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={dropdownStyle}>
                        {this.state.library &&
                            this.state.library.map((book) => (
                                <Dropdown.Item>{book.title}</Dropdown.Item>
                            ))}
                    </Dropdown.Menu>
                </Dropdown>

                <br></br>
                <div style={collectionListStyle}>
                    <CollectionList
                        collectionList={this.state.collectionList}
                        delCollection={this.delCollection}
                        selectCollection={this.selectCollection}
                    />
                </div>
                <h2>
                    <Collection
                        key={this.state.currentCollection.id}
                        currentCollection={this.state.currentCollection}
                        removeBook={this.removeBook}
                        userCollections={this.state.collectionList}
                        addToCollection={this.addToCollection}
                    />
                </h2>
            </div>
        );
    }
}

const dropdownStyle = {
    maxHeight: "256px",
    overflowY: "scroll",
};

const collectionListStyle = {
    border: "3px #ccc solid",
    width: "500px",
};

const dropDownStyle = {
    height: "70px",
    overflowY: "scroll",
};

export default UserHome;
