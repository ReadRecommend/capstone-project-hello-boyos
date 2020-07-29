import React, { Component } from "react";
import { Navbar, Nav, Button, NavDropdown, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { bookDetailsContext } from "../BookDetailsContext";

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
        this.setState({ Redirect: true });
    };

    handleKeyDown = (e) => {
        e.persist();
        if (e.key === "Enter") {
            this.handleSubmit();
        }
    };

    handleToggle = (e) => {
        console.log("butt");
    };

    renderRedirect = () => {
        const { type, search } = this.state;
        if (this.state.Redirect) {
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
            <Nav style={{ marginRight: "10px" }}>
                <Form inline onSubmit={this.handleSubmit}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            value={this.state.search}
                            onChange={this.updateSearch}
                            style={{ width: "200px" }}
                        />
                        <Form.Control
                            as="select"
                            defaultValue={"Books"}
                            onChange={this.changeSearchType}
                            style={{ width: "91px" }}
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
                    {this.props.loggedInRole === "Admin" && (
                        // If we are an admin
                        <NavDropdown title="Admin Pages">
                            <NavDropdown.Item href="/admin/bookList">
                                Book List
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/admin/addBook">
                                Add New Book
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/admin/userList">
                                User List
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                    {this.props.loggedInRole === "User" && (
                        <>
                            <Nav.Link href="/discover">Discover</Nav.Link>
                            <Nav.Link href="/goals">My Goals</Nav.Link>
                        </>
                    )}
                </Nav>
                {this.renderSearchBar()}
                {this.renderRedirect()}
                <Nav style={{ marginRight: "10px" }}>
                    <BootstrapSwitchButton
                        checked={this.context}
                        width="100"
                        onlabel="Mystery"
                        offlabel="Certainty"
                        onstyle="primary"
                        onChange={this.props.toggleBookDetails}
                    />
                </Nav>
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

NavigationBar.contextType = bookDetailsContext;

export default NavigationBar;
