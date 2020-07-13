import React, { Component } from "react";
import { getUserById } from "../fetchFunctions";
import CollectionList from "../components/CollectionList/CollectionList";
import FollowButton from "../components/FollowButton";
import Collection from "../components/Collection";
import { Container, Col, Row } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

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
                console.log(json);
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
        fetch(`http://localhost:5000/collection/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                this.setState({ currentCollection: json });
            });
    };

    notify = (message) => {
        toast.info(message);
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
                    <ToastContainer
                        autoClose={4000}
                        pauseOnHover
                        closeOnClick
                    />
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
            // Didn't find a valid user
            return <h1>404 User not found</h1>;
        }
    }
}

export default UserPage;
