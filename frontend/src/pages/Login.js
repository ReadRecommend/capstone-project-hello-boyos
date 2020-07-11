import React, { Component } from "react";
import { Alert, Button, Form, Container } from "react-bootstrap";
import { Cookies } from "react-cookie";

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
                const errorMessage = JSON.parse(error.message).message;
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
                {/* <form> */}
                <Container>
                    <br></br>
                    <h1>Login</h1>
                    <br></br>
                    <Form method="POST" onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Username"
                                value={this.state.username}
                                onChange={this.updateUsername}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={this.state.password}
                                onChange={this.updatePassword}
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            block
                            value="Sign In"
                        >
                            Sign In
                        </Button>
                    </Form>
                    <br></br>
                    <p className="text-center"> or </p>
                    <Button
                        className="text-centre"
                        variant="outline-secondary"
                        href="/createaccount"
                        block
                    >
                        Create an Account
                    </Button>
                </Container>
                {/* </form> */}
            </div>
        );
    }
}

export default Login;
