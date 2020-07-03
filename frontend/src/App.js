import React, { Component } from 'react';
import Main from './Main'
import { Navbar, Nav, Button } from "react-bootstrap";

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: localStorage.getItem("loggedIn")
        };
    }

    render() {
        return (
            <div className="App" >
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="/">ReadRecommend</Navbar.Brand>
                    <Nav className="mr-auto"></Nav>
                    <Nav>
                        <Button
                            variant="outline-info"
                            href={this.state.loggedIn === "true" ? "/logout" : "/login"}
                        >
                            {this.state.loggedIn === "true"
                                ? "Logout"
                                : "Login / Signup"}
                            </Button>
                    </Nav>
                </Navbar>
                <Main/>
            </div>
        );
    }
}

export default App;