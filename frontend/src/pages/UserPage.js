import React, { Component } from "react";
import { getUserById } from "../fetchFunctions";
import CollectionList from "../components/CollectionList/CollectionList";
import Collection from "../components/Collection";
import { Button, Container, Col, Row } from "react-bootstrap";
import { unfollowUser, followUser } from "../fetchFunctions";

class UserPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            userPageInfo: {},
            collectionList: [],
            currentCollection: {},
            following: false,
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
                    if (
                        this.state.userPageInfo.followers.find(
                            (o) => o.id === this.state.currentUser.id
                        )
                    ) {
                        this.setState({ following: true });
                    }
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
        fetch(`http://localhost:5000/collection/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                this.setState({ currentCollection: json });
            });
    };

    handleUnfollow = (followerUsername, userUsername) => {
        unfollowUser(followerUsername, userUsername).then((user) => {
            if (user) {
                this.setState({ following: false, currentUser: user });
            }
        });
    };

    handleFollow = (followerUsername, userUsername) => {
        followUser(followerUsername, userUsername).then((user) => {
            if (user) {
                this.setState({ following: true, currentUser: user });
            }
        });
    };

    render() {
        if (this.state.loading) {
            // Still performing the fetch
            return <h1>LOADING USER PAGE...</h1>;
        }
        if (this.state.userPageInfo) {
            // Found a valid user
            const user = this.state.userPageInfo;
            return (
                <div className="UserPage">
                    <br></br>
                    <Container fluid>
                        <h2>{user.username}'s Profile</h2>
                        <Row>
                            <Col md="2">
                                {!this.state.following &&
                                    this.state.currentUser && (
                                        <p>
                                            <Button
                                                block
                                                variant="info"
                                                onClick={() => {
                                                    this.handleFollow(
                                                        this.state.currentUser
                                                            .username,
                                                        user.username
                                                    );
                                                }}
                                            >
                                                Follow
                                            </Button>
                                        </p>
                                    )}
                                {this.state.following && (
                                    <p>
                                        <Button
                                            block
                                            variant="info"
                                            onClick={() => {
                                                this.handleUnfollow(
                                                    this.state.currentUser
                                                        .username,
                                                    user.username
                                                );
                                            }}
                                        >
                                            Unfollow
                                        </Button>
                                    </p>
                                )}
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
                        {/* <h4>Collections</h4>
                        <div className="collection_list"></div> */}
                    </Container>
                </div>
            );
        } else {
            // Didn't find a valid user
            return <h1>404 User not found</h1>;
        }
    }
}

export default UserPage;
