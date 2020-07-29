import React, { Component } from "react";
import Main from "./Main";
import NavigationBar from './components/NavBar.js'
import { loginContext } from "./LoginContext";
import { bookDetailsContext } from "./BookDetailsContext";
import { Link } from "react-router-dom";

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedInRole: localStorage.getItem("loggedInRole"),
            hideBook: false
        };
    }

    // We need to call this function to rerender the navbar properly
    updateLogin = () => {
        this.setState({ loggedInRole: localStorage.getItem("loggedInRole") });
    };

    toggleBookDetails = () => {
        this.setState({ book})
    }

    render() {
        return (
            <div className="App" >
                <bookDetailsContext.Provider value={}>
                    <NavigationBar loggedInRole={this.state.loggedInRole} />
                    <loginContext.Provider value={this.updateLogin}>
                        <Main />
                    </loginContext.Provider>
                </bookDetailsContext.Provider>
                
            </div>
        );
    }
}

export default App;
