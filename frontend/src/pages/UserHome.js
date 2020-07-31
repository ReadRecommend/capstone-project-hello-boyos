import React, { Component } from "react";
import { Modal, Button, Container, Col, Row, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import Collection from "../components/Collection";
import CollectionList from "../components/CollectionList/CollectionList";
import AddCollection from "../components/CollectionList/AddCollection";
import FollowList from "../components/FollowList";
import {
    unfollowUser,
    getCollectionOverview,
    deleteCollection,
    addCollection,
    removeFromCollection,
    getCollection,
    addToCollection,
} from "../fetchFunctions";
import { toast } from "react-toastify";

class UserHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: this.props.initialUserInfo,
            collectionList: this.props.initialUserInfo.collections,
            currentCollection: {},
            addCollectionModalShow: false,
            loading: false,
        };
    }

    componentDidMount() {
        // If we are admin we shouldn't have a user page
        if (this.props.initialUserInfo.roles.includes("admin")) {
            return this.props.history.push("/admin");
        }

        // Select the initial collection
        this.selectCollection(this.state.collectionList[0]["id"]);
    }

    // Function that makes the add collection modal show/not show
    handleAddCollectionModal() {
        this.setState({
            addCollectionModalShow: !this.state.addCollectionModalShow,
        });
    }

    handleUnfollow = (followerUsername, userUsername) => {
        unfollowUser(followerUsername, userUsername).then((user) => {
            if (user) {
                this.setState({ userInfo: user });
            }
            toast.success(`Successfully unfollowed ${userUsername}`);
        });
    };

    // Function that deletes a collection in a user's collection list
    delCollection = (name) => {
        // We will let the backend do the checking for us
        deleteCollection(this.state.userInfo.id, name)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                toast.success(`Successfully deleted collection ${name}`);
                this.setState({
                    userInfo: json,
                    collectionList: json.collections,
                });
            })
            .then(() => {
                this.selectOverview("all_books");
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    };

    // Function that adds a collection to a user's collection list
    addCollection = (name) => {
        if (!name) {
            toast.error("Please provide a collection name");
            return;
        }

        // We will let the backend do the checking for us
        addCollection(this.state.userInfo.id, name)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                toast.success(`Successfully created new collection '${name}'`);
                this.setState({
                    userInfo: json,
                    collectionList: json.collections,
                });
                this.handleAddCollectionModal();
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    };

    /*
      Remove book makes a call to the API to remove a book from the current collection
      upon the user clicking the remove book button. The new collection without the book
      is returned and set as the current collection.
      */
    removeBook = (bookID) => {
        const book = this.state.currentCollection.books.find((book) => {
            return book.id === bookID;
        });
        removeFromCollection(bookID, this.state.currentCollection.id)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                toast.success(
                    `Successfully removed book ${book.title} from collection ${json.name}`
                );
                this.setState({ currentCollection: json });
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    };

    /*
      The selectCollection function takes the id of a collection and 
      changes the state of the page and refreshes it so that the 
      selected collection can then be displayed.
      */
    selectCollection = (id) => {
        this.setState({ loading: true });

        getCollection(id)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                this.setState({ currentCollection: json, loading: false });
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    };

    selectOverview = (overviewName) => {
        this.setState({ loading: true });
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
                this.setState({ currentCollection: json, loading: false });
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

    addBookToCollection = (bookID, collectionID) => {
        addToCollection(bookID, collectionID)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then((json) => {
                const book = json.books.find((book) => {
                    return book.id === bookID;
                });
                toast.success(
                    `Successfully added book ${book.title} to collection ${json.name}`
                );
                this.setState({ currentCollection: json });
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    };

    renderCollection = () => {
        const currentCollection = this.state.currentCollection;
        if (this.state.loading === true) {
            return (
                <Spinner
                    animation="border"
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                    }}
                />
            );
        } else if (!currentCollection.books) {
            return (
                <h3
                    style={{
                        textAlign: "center",
                        color: "grey",
                    }}
                >
                    No collection is currently selected
                </h3>
            );
        } else if (currentCollection && currentCollection.books.length === 0) {
            return (
                <>
                    <h3
                        style={{
                            textAlign: "center",
                            color: "grey",
                        }}
                    >
                        You currently have no books in this collection. Add
                        some!
                    </h3>
                    <center>
                        <Button href="/search">Search</Button>
                    </center>
                </>
            );
        } else {
            return (
                <Collection
                    key={this.state.currentCollection.id}
                    currentCollection={this.state.currentCollection}
                    removeBook={this.removeBook}
                    userCollections={this.state.collectionList}
                    addToCollection={addToCollection}
                    editable={
                        true &&
                        this.state.currentCollection.name !== "All" &&
                        this.state.currentCollection.name !== "Recently Read"
                    }
                />
            );
        }
    };

    render() {
        return (
            <div className="UserHome">
                <br></br>
                {/* Modal for creating a new collection */}
                <Modal
                    show={this.state.addCollectionModalShow}
                    onHide={() => this.handleAddCollectionModal()}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Collection</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AddCollection addCollection={this.addCollection} />
                    </Modal.Body>
                </Modal>

                <Container fluid>
                    <h2>Welcome {this.state.userInfo.username} </h2>
                    <Row>
                        <Col md="2">
                            <p>
                                <Button
                                    block
                                    onClick={() => {
                                        this.handleAddCollectionModal();
                                    }}
                                >
                                    Create a collection
                                </Button>
                                <Button href="/search" block>
                                    Search Books
                                </Button>
                                <Button href="/usrsearch" block>
                                    Search Users
                                </Button>
                                <Button href="/goals" block>
                                    My Goals
                                </Button>
                            </p>

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

                            {this.renderCollection()}
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

export default UserHome;
