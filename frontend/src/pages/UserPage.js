import React, { Component } from "react";
import {
    getUserById,
    getCollectionOverview,
    getCollection,
} from "../fetchFunctions";
import CollectionList from "../components/CollectionList/CollectionList";
import FollowButton from "../components/FollowButton";
import Collection from "../components/Collection";
import { toast } from "react-toastify";
import { Container, Col, Row, Spinner } from "react-bootstrap";
import Error from "../components/Error";

class UserPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            userPageInfo: {},
            collectionList: [],
            currentCollection: {},
            currentUser: null,
        };
    }

    componentDidMount() {
        // Fetch the user's page based on the url
        getUserById(this.props.match.params.userId)
            .then((res) => {
                if (!res.ok) {
                    // Something went wrong, likely there is no user with the id specified in the url
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                // Found a valid user
                return res.json();
            })
            .then((json) => {
                this.setState({
                    userPageInfo: json,
                    loading: false,
                    collectionList: json.collections,
                });

                // Select the initial collection
                this.selectCollection(this.state.collectionList[0]["id"]);
                if (this.props.initialUserInfo) {
                    this.setState({ currentUser: this.props.initialUserInfo });
                }
            })
            .catch((error) => {
                this.setState({ userPageInfo: null, loading: false });
            });
    }

    /*
    The selectCollection function takes the id of a collection and 
    changes the state of the page and refreshes it so that the 
    selected collection can then be displayed.
    */
    selectCollection = (id) => {
        getCollection(id)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
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

    selectOverview = (overviewName) => {
        getCollectionOverview(this.state.userPageInfo.username, overviewName)
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

    notify = (message, type) => {
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "error":
                toast.error(message);
                break;
            default:
                toast.info(message);
        }
    };

    render() {
        if (this.state.loading) {
            // Still performing the fetch
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
        }
        if (
            this.state.userPageInfo &&
            !this.state.userPageInfo.roles.includes("admin")
        ) {
            // Found a valid user
            const user = this.state.userPageInfo;
            return (
                <div className="UserPage">
                    <br></br>
                    <Container fluid>
                        <h2>{user.username}'s Profile</h2>
                        <Row>
                            <Col md="2">
                                {this.state.currentUser && (
                                    <FollowButton
                                        user={user}
                                        currentUser={this.state.currentUser}
                                        notify={this.notify}
                                    />
                                )}
                                <h4>Books</h4>
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
                                    currentCollection={
                                        this.state.currentCollection
                                    }
                                />
                                <br></br>
                                <h4>Collections</h4>
                                <CollectionList
                                    collectionList={user.collections}
                                    selectCollection={this.selectCollection}
                                    editable={false}
                                    currentCollection={
                                        this.state.currentCollection
                                    }
                                />
                            </Col>
                            <Col>
                                <h1>{this.state.currentCollection.name}</h1>
                                <br></br>
                                <Collection
                                    key={this.state.currentCollection.id}
                                    currentCollection={
                                        this.state.currentCollection
                                    }
                                    userCollections={this.state.collectionList}
                                    editable={false}
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>
            );
        } else {
            // Didn't find a valid user, or the user is an admin who shouldn't have a page
            return (
                <Error
                    errorCode="404"
                    errorMessage="The user you're looking for does not exist"
                ></Error>
            );
        }
    }
}

export default UserPage;
