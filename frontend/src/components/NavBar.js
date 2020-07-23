import React, { Component } from 'react';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import PropTypes from "prop-types";


class NavigationBar extends Component {

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
    loggedInRole: PropTypes.object.isRequired,
};

export default NavigationBar;
