import React, { Component } from 'react';
import Main from './Main'
import { Navbar, Nav, Button } from 'react-bootstrap';
import { loginContext } from './LoginContext';

import './App.css';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: localStorage.getItem("loggedIn")
        };
    }

    // We need to call this function to rerender the navbar properly
    updateLogin = () => {
        this.setState({ loggedIn: localStorage.getItem("loggedIn") })
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
                <loginContext.Provider value={this.updateLogin}>
                    <Main />
                </loginContext.Provider>
            </div>
        );
    }
}

export default App;