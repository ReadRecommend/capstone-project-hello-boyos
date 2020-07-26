import React, { Component } from "react";
import {
    Modal,
    Alert,
    Dropdown,
    Button,
    Container,
    Col,
    Row,
} from "react-bootstrap";
import PropTypes from "prop-types";
import Collection from "../components/Collection";
import CollectionList from "../components/CollectionList/CollectionList";
import AddCollection from "../components/CollectionList/AddCollection";
import FollowList from "../components/FollowList";
import { unfollowUser, getCollectionOverview } from "../fetchFunctions";
import { toast, ToastContainer } from "react-toastify";

class UserHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: this.props.initialUserInfo,
            collectionList: this.props.initialUserInfo.collections,
            currentCollection: {},
            modalShow: false,
            libraryModalShow: false,
            errorGeneralShow: false,
            errorGeneralMessage: "",
            errorAddCollectionShow: false,
            errorAddCollectionMessage: "",
            libraryBook: {},
        };
    }

    componentDidMount() {
        // If we are admin we shouldn't have a user page
        if (this.props.initialUserInfo.roles.includes("admin")) {
            return this.props.history.push("/admin");
        }

        // Select the initial collection
        this.selectCollection(this.state.collectionList[0]["id"]);

        // Get all the books in the database
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

    handleLibraryModal() {
        this.setState({
            libraryModalShow: !this.state.libraryModalShow,
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

    handleUnfollow = (followerUsername, userUsername) => {
        unfollowUser(followerUsername, userUsername).then((user) => {
            if (user) {
                this.setState({ userInfo: user });
            }
        });
    };

    // Function that deletes a collection in a user's collection list
    delCollection = (name) => {
        const data = { reader_id: this.state.userInfo.id, name: name };

        // We will let the backend do the checking for us
        fetch("http://localhost:5000/collection", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
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
                this.setState({
                    userInfo: json,
                    collectionList: json.collections,
                });
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
        const data = { reader_id: this.state.userInfo.id, name: name };

        // We will let the backend do the checking for us
        fetch("http://localhost:5000/collection", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
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
                this.setState({
                    userInfo: json,
                    collectionList: json.collections,
                });
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
    removeBook = (bookID) => {
        fetch("http://localhost:5000/collection/modify", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                book_id: bookID,
                collection_id: this.state.currentCollection.id,
            }),
            credentials: "include",
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

    selectOverview = (overviewName) => {
        getCollectionOverview(this.state.userInfo.username, overviewName)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                this.setState({ currentCollection: json });
            })
            .catch((error) => {
                // An error occurred
                let errorMessage =
                    "Something went wrong getting this collection overview";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    };

    addToCollection = (bookID, collectionID) => {
        fetch("http://localhost:5000/collection/modify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                book_id: bookID,
                collection_id: collectionID,
            }),
            credentials: "include",
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
                <br></br>
                {/* Alert for general problems */}
                <Alert
                    show={this.state.errorGeneralShow}
                    onClose={() => this.handleGeneralError()}
                    variant="danger"
                    dismissible
                >
                    {this.state.errorGeneralMessage}
                </Alert>
                <ToastContainer autoClose={4000} pauseOnHover closeOnClick />
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

                    <Modal.Header closeButton>
                        <Modal.Title>Create New Collection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddCollection addCollection={this.addCollection} />
                    </Modal.Body>
                </Modal>

                <Modal
                    show={this.state.libraryModalShow}
                    onHide={() => this.handleLibraryModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Add{" "}
                            {this.state.libraryBook &&
                                this.state.libraryBook.title}
                            to{" "}
                            {this.state.currentCollection.name
                                ? this.state.currentCollection.name
                                : "<choose a collection>"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button
                            onClick={() => {
                                this.addToCollection(
                                    this.state.libraryBook.id,
                                    this.state.currentCollection.id
                                );
                                this.handleLibraryModal();
                            }}
                            block
                        >
                            Add
                        </Button>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
                <Container fluid>
                    <h2>Welcome {this.state.userInfo.username} </h2>
                    <Row>
                        <Col md="2">
                            <p>
                                <Button
                                    block
                                    onClick={() => {
                                        this.handleModal();
                                    }}
                                >
                                    Create a collection
                                </Button>
                                <Button href="/search" block>
                                    Search
                                </Button>
                                <Button href="/usrsearch" block>
                                    User Search
                                </Button>
                                <Button href="/goals" block>
                                    My Goals
                                </Button>
                            </p>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="success"
                                    id="dropdown-basic"
                                    className="btn-block"
                                >
                                    Add a book to the current collection
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={dropdownStyle}>
                                    {this.state.library &&
                                        this.state.library.map((book) => (
                                            <Dropdown.Item
                                                key={book.id}
                                                onClick={() => {
                                                    this.setState({
                                                        libraryBook: book,
                                                    });
                                                    this.handleLibraryModal();
                                                }}
                                            >
                                                {book.title}
                                            </Dropdown.Item>
                                        ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <br></br>
                            <h4>Your Books</h4>
                            <CollectionList
                                collectionList={[
                                    { name: "All", id: "all_books" },
                                    {
                                        name: "Recently Read",
                                        id: "recently_read",
                                    },
                                ]}
                                delCollection={null}
                                selectCollection={this.selectOverview}
                                editable={false}
                                currentCollection={this.state.currentCollection}
                            />
                            <br></br>
                            <h4>Your Collections</h4>
                            <CollectionList
                                collectionList={this.state.collectionList}
                                delCollection={this.delCollection}
                                selectCollection={this.selectCollection}
                                editable={true}
                                currentCollection={this.state.currentCollection}
                            />
                            <br></br>
                            <h4>Following</h4>
                            <FollowList
                                user={this.state.userInfo}
                                handleUnfollow={this.handleUnfollow}
                            />
                        </Col>

                        <Col>
                            <h1>{this.state.currentCollection.name}</h1>
                            <br></br>
                            <Collection
                                key={this.state.currentCollection.id}
                                currentCollection={this.state.currentCollection}
                                removeBook={this.removeBook}
                                userCollections={this.state.collectionList}
                                addToCollection={this.addToCollection}
                                editable={
                                    true &&
                                    this.state.currentCollection.name !=
                                        "All" &&
                                    this.state.currentCollection.name !=
                                        "Recently Read"
                                }
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

UserHome.propTypes = {
    initialUserInfo: PropTypes.object.isRequired,
};

const dropdownStyle = {
    maxHeight: "512px",
    overflowY: "scroll",
};

export default UserHome;
