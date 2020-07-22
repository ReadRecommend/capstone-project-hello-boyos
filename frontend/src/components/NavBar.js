import React, { Component } from 'react';
import Main from './Main'
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { loginContext } from './LoginContext';
import { Link } from 'react-router-dom';

class Navbar extends Component {

    render () {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">ReadRecommend</Navbar.Brand>
                <Nav className="mr-auto">
                    <Navbar.Text className="navbar_role">
                        You are: {this.props.loggedInRole || "Not logged in"}
                    </Navbar.Text>
                    {this.state.loggedInRole == "Admin" &&
                        // If we are an admin
                        <NavDropdown title="Admin Pages">
                            <NavDropdown.Item href="/admin/bookList">Book List</NavDropdown.Item>
                            <NavDropdown.Item href="/admin/addBook">Add New Book</NavDropdown.Item>
                        </NavDropdown>
                    }
                    {this.state.loggedInRole == "User" &&
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
                        href={this.state.loggedInRole ? "/logout" : "/login"}
                    >
                        {this.state.loggedInRole
                            ? "Logout"
                            : "Login / Signup"}
                    </Button>
                </Nav>
            </Navbar>
        );
    }
}

Na.propTypes = {
    currentCollection: PropTypes.object.isRequired,
};