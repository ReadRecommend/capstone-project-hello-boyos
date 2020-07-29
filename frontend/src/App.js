import React, { Component } from "react";
import Main from "./Main";
import NavigationBar from "./components/NavBar.js";
import { loginContext } from "./LoginContext";

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
                <NavigationBar loggedInRole={this.state.loggedInRole} />
                <loginContext.Provider value={this.updateLogin}>
                    <Main />
                </loginContext.Provider>
            </div>
        );
    }
}

export default App;
