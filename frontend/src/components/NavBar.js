import React, { Component } from 'react';
import { Navbar, Nav, Button, NavDropdown, Form, Row, Col } from 'react-bootstrap';
import InputGroup from "react-bootstrap/InputGroup"; 
import PropTypes from "prop-types";
import { Router, Route, Redirect} from 'react-router';


class NavigationBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            search: "",
            type: "book",

        };
    }

    updateSearch = (event) => {
        event.persist();
        this.setState({ search: event.target.value });
    }

    changeSearchType = (event) => {
        event.persist();
        this.setState({ type: event.target.value }, () => {
            this.handleSubmit(event); // Call asynchronously
        });
    }

    renderRedirect = () => {
        const {type, search} = this.state
        if(type === "book") {
            return(
                <Redirect
                    to={{
                        pathname:'/search',
                        state: {navSearch:search}
                    }}
                />
            );
        } else if (type === "user") {
            return (
                <Redirect
                    to={{
                        pathname:'/search/user',
                        state: {navSearch:search}
                    }}
                />
            );
        }

    }

    render () {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">ReadRecommend</Navbar.Brand>
                <Nav className="mr-auto">
                    <Navbar.Text className="navbar_role">
                        You are: {this.props.loggedInRole || "Not logged in"}
                    </Navbar.Text>
                    {this.props.loggedInRole == "Admin" &&
                        // If we are an admin
                        <NavDropdown title="Admin Pages">
                            <NavDropdown.Item href="/admin/bookList">Book List</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/addBook">Add New Book</NavDropdown.Item>
                        </NavDropdown>
                    }
                    {this.props.loggedInRole == "User" &&
                        // If we are a user
                        <Nav>
                            <Nav.Link href="/search">Search for Books</Nav.Link>
                            <Nav.Link href="/usrsearch">Search for Users</Nav.Link>
                        </Nav>
                    }      
                </Nav>
                {<Nav className="mr-auto">
                    <Form inline method="POST" onSubmit={this.handleSubmit}>
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
                                <Button variant="primary" type="submit" block value="Search">
                                    Search
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Nav>}
                {this.state.search.length > 0 && this.renderRedirect}
                <Nav>
                    <Button
                        variant="outline-info"
                        href={this.props.loggedInRole ? "/logout" : "/login"}
                    >
                        {this.props.loggedInRole
                            ? "Logout"
                            : "Login / Signup"}
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
