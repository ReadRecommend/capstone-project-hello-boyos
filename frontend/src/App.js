import React, { Component } from "react";
import Main from "./Main";
import { Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { loginContext } from "./LoginContext";
import { Link } from "react-router-dom";

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedInRole: localStorage.getItem("loggedInRole"),
        };
    }

    // We need to call this function to rerender the navbar properly
    updateLogin = () => {
        this.setState({ loggedInRole: localStorage.getItem("loggedInRole") });
    };

    render() {
        return (
            <div className="App">
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">ReadRecommend</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Navbar.Text className="navbar_role">
                            You are:{" "}
                            {this.state.loggedInRole || "Not logged in"}
                        </Navbar.Text>
                        {this.state.loggedInRole === "Admin" && (
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
                                <Nav.Link href="/search">
                                    Search for Books
                                </Nav.Link>
                                <Nav.Link href="/usrsearch">
                                    Search for Users
                                </Nav.Link>
                                <Nav.Link href="/goals">My Goals</Nav.Link>
                            </Nav>
                        )}
                    </Nav>
                    <Nav>
                        <Button
                            variant="outline-info"
                            href={
                                this.state.loggedInRole ? "/logout" : "/login"
                            }
                        >
                            {this.state.loggedInRole
                                ? "Logout"
                                : "Login / Signup"}
                        </Button>
                    </Nav>
                </Navbar>
                <loginContext.Provider value={this.updateLogin}>
                    <Main />
                </loginContext.Provider>
            </div>
        );
    }
}

export default App;
