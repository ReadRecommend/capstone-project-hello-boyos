import React, { Component } from "react";
import Main from "./Main";
import NavigationBar from "./components/NavBar.js";
import { loginContext } from "./LoginContext";
import { bookDetailsContext } from "./BookDetailsContext";
import { ToastContainer } from "react-toastify";

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedInRole: localStorage.getItem("loggedInRole"),
            hideBookDetails: JSON.parse(
                localStorage.getItem("hideBookDetails")
            ),
        };
    }

    // We need to call this function to rerender the navbar properly
    updateLogin = () => {
        this.setState({ loggedInRole: localStorage.getItem("loggedInRole") });
    };

    toggleBookDetails = (e) => {
        const { hideBookDetails } = this.state;
        this.setState(
            { hideBookDetails: !hideBookDetails },
            this.setBookDetails.bind(this)
        );
    };

    setBookDetails = () => {
        localStorage.setItem("hideBookDetails", this.state.hideBookDetails);
    };

    render() {
        return (
            <div className="App">
                <ToastContainer autoClose={4000} pauseOnHover closeOnClick />
                <bookDetailsContext.Provider value={this.state.hideBookDetails}>
                    <NavigationBar
                        loggedInRole={this.state.loggedInRole}
                        toggleBookDetails={this.toggleBookDetails}
                    />
                    <loginContext.Provider value={this.updateLogin}>
                        <Main />
                    </loginContext.Provider>
                </bookDetailsContext.Provider>
            </div>
        );
    }
}

export default App;
