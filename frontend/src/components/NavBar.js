import React, { Component } from "react";
import {
    Navbar,
    Nav,
    Button,
    NavDropdown,
    Form,
    Row,
    Col,
} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import PropTypes from "prop-types";
import { Router, Route, Redirect, useLocation } from "react-router";

class NavigationBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: "",
            type: "Books",
            Redirect: false,
        };
    }

    updateSearch = (event) => {
        event.persist();
        this.setState({ search: event.target.value });
    };

    changeSearchType = (event) => {
        event.persist();
        this.setState({ type: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("Handle submit");
        this.setState({ Redirect: true });
    };

    handleKeyDown = (e) => {
        e.persist();
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    };

    renderRedirect = () => {
        const { type, search } = this.state;
        if (this.state.Redirect) {
            console.log("rendering now");
            if (type === "Books") {
                return (
                    <Redirect
                        to={{
                            pathname: "/search",
                            state: { navSearch: search },
                        }}
                    />
                );
            } else if (type === "Users") {
                return (
                    <Redirect
                        to={{
                            pathname: "/usrsearch",
                            state: { navSearch: search },
                        }}
                    />
                );
            }
        }
    };

    renderSearchBar = () => {
        return (
            <Nav className="mr-auto">
                <Form inline onSubmit={this.handleSubmit}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={this.state.search}
                            onChange={this.updateSearch}
                        />
                        <Form.Control
                            as="select"
                            defaultValue={"Books"}
                            onChange={this.changeSearchType}
                        >
                            <option>Books</option>
                            <option>Users</option>
                        </Form.Control>
                        <InputGroup.Append>
                            <Button
                                variant="primary"
                                block
                                value="Search"
                                type="submit"
                            >
                                Search
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
            </Nav>
        );
    };

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">ReadRecommend</Navbar.Brand>
                <Nav className="mr-auto">
                    <Navbar.Text className="navbar_role">
                        You are: {this.props.loggedInRole || "Not logged in"}
                    </Navbar.Text>
                    {this.props.loggedInRole === "Admin" && (
                        // If we are an admin
                        <NavDropdown title="Admin Pages">
                            <NavDropdown.Item href="/admin/bookList">
                                Book List
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/admin/addBook">
                                Add New Book
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                    {this.state.loggedInRole === "User" && (
                        // If we are a user
                        <Nav>
                            <Nav.Link href="/discover">Discover</Nav.Link>
                            <Nav.Link href="/goals">My Goals</Nav.Link>
                        </Nav>
                    )}
                </Nav>
                {this.renderSearchBar()}
                {this.renderRedirect()}
                <Nav>
                    <Button
                        variant="outline-info"
                        href={this.props.loggedInRole ? "/logout" : "/login"}
                    >
                        {this.props.loggedInRole ? "Logout" : "Login / Signup"}
                    </Button>
                </Nav>
            </Navbar>
        );
    }
}

NavigationBar.propTypes = {
    loggedInRole: PropTypes.string.isRequired,
};

export default NavigationBar;
