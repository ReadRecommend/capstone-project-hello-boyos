import React, { Component } from "react";
import { Button, Form, Container, Spinner } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import UserSearchResults from "../../components/UserSearch/UserSearchResults.js";
import { toast } from "react-toastify";

import { searchUsers } from "../../fetchFunctions";

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            currentSearchList: [],
            loading: false,
        };
    }

    componentDidMount() {
        const { location } = this.props;
        if (location.state && location.state.navSearch.length > 0) {
            this.setState(
                { search: location.state.navSearch },
                this.handleSubmit.bind(this)
            );
        }
    }

    updateSearch = (event) => {
        this.setState({ search: event.target.value });
    };

    handleSubmit = (event) => {
        if (event) event.preventDefault();
        this.setState({ loading: true });

        searchUsers(this.state.search)
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }
                return res.json();
            })
            .then((users) => {
                this.setState({
                    currentSearchList: users,
                    loading: false,
                });
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

    removeCurrentUser = (userList) => {
        if (!this.props.initialUserInfo) {
            return userList;
        }
        let users = [];
        userList.forEach((user) => {
            if (user.id !== this.props.initialUserInfo.id) {
                users.push(user);
            }
        });
        return users;
    };

    renderResults = () => {
        if (this.state.loading) {
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
        } else if (this.state.currentSearchList.length === 0) {
            return (
                <h3 style={{ textAlign: "center", color: "grey" }}>
                    {" "}
                    There are currently no results to display.{" "}
                </h3>
            );
        } else {
            return (
                <UserSearchResults
                    users={this.removeCurrentUser(this.state.currentSearchList)}
                />
            );
        }
    };

    render() {
        return (
            <div className="Search">
                <Container>
                    <h1> User Search Page </h1>
                    <Form method="POST" onSubmit={this.handleSubmit}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search Username"
                                value={this.state.search}
                                onChange={this.updateSearch}
                            />
                            <InputGroup.Append>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    value="Search"
                                >
                                    Search
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    <br></br>
                    {this.renderResults()}
                </Container>
            </div>
        );
    }
}

export default Search;
