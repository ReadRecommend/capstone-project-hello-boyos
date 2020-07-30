import React, { Component } from "react";
import { Button, Form, Container } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import UserSearchResults from "../components/UserSearchResults.js";

class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            currentSearchList: [],
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
        const data = {
            search: this.state.search,
        };
        fetch("http://localhost:5000/search/users", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
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
                });
            });
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

                            <Button
                                variant="primary"
                                type="submit"
                                block
                                value="Search"
                            >
                                Search
                            </Button>
                        </InputGroup>
                    </Form>
                    <br></br>
                    {this.state.currentSearchList.length == 0 ? (
                        <h3 style={{ textAlign: "center", color: "grey" }}>
                            {" "}
                            There are currently no results to display.{" "}
                        </h3>
                    ) : (
                        <UserSearchResults
                            users={this.state.currentSearchList}
                        />
                    )}
                </Container>
            </div>
        );
    }
}

export default Search;