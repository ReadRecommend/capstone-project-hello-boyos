import React, { Component } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { Cookies } from 'react-cookie';

import "./Login.css";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            access_token: "",
            errorShow: false,
            errorMessage: "",
        };
    }

    updateUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    updatePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    // Function that makes the error not show
    handleError() {
        this.setState({ errorShow: false, errorMessage: "" });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.state.username || !this.state.password) {
            this.setState({
                errorShow: true,
                errorMessage: "Please fill in the required fields",
            });
            return;
        }

        const data = {
            username: this.state.username,
            password: this.state.password,
        };
        fetch("http://localhost:5000/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }
                return res.json();
            })
            .then((json) => {

                // Put our access token in the cookie
                let cookie = new Cookies();
                cookie.set("accessToken", json.access_token, { path: "/" });

                // Set logged in to true in localstorage
                // NOTE this is purely for the nav bar, so a user can change it and it will confuse
                // the nav bar, but that is it
                localStorage.setItem("loggedIn", "true");

                // Change route to home
                return this.props.history.push("/home");
            })
            .catch((error) => {
                // An error occurred
                const errorMessage = error.message.message || error.message;
                this.setState({ errorShow: true, errorMessage: errorMessage });
            });
    };

    render() {
        return (
            <div className="Login">
                {/* Alert for general problems */}
                <Alert
                    show={this.state.errorShow}
                    onClose={() => this.handleError()}
                    variant="danger"
                    dismissible
                >
                    {this.state.errorMessage}
                </Alert>

                <h1>Login</h1>
                <br></br>
                <div>
                    <form method="POST" onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.updateUsername}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.updatePassword}
                            required
                        />
                        <input type="submit" value="Sign In" className="btn" />
                    </form>
                </div>

                <Button variant="primary" href="/createaccount">
                    Create an Account
                </Button>
            </div>
        );
    }
}

export default Login;
