import React, { Component } from "react";
import { Alert, Button, Form, Container } from "react-bootstrap";

import "./Login.css";

class CreateAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            password: "",
            errorShow: false,
            errorMessage: "",
        };
    }

    updateUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    updateEmail = (event) => {
        this.setState({ email: event.target.value });
    };

    updatePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    updatePasswordConfirm = (event) => {
        this.setState({ password_confirm: event.target.value });
    };

    // Function that makes the error not show
    handleError() {
        this.setState({ errorShow: false, errorMessage: "" });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.state.username || !this.state.email || !this.state.password) {
            this.setState({
                errorShow: true,
                errorMessage: "Please fill in the required fields",
            });
            return;
        }

        const data = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
        };
        fetch("http://localhost:5000/auth/signup", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    this.setState({
                        errorShow: true,
                        errorMessage:
                            "This username or password is currently in use. Please choose another",
                    }).then(() => {
                        throw Error;
                    });
                }
                return res.json();
            })
            .then(() => {
                // Change route to login
                return this.props.history.push("/login");
            })
            .catch((e) => { });
    };

    render() {
        return (
            <div className="CreateAccount">
                {/* Alert for general problems */}
                <Alert
                    show={this.state.errorShow}
                    onClose={() => this.handleError()}
                    variant="danger"
                    dismissible
                >
                    {this.state.errorMessage}
                </Alert>
                <Container>
                    <br></br>
                    <h1>Create an Account</h1>
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
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={this.state.email}
                                onChange={this.updateEmail}
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
                        <Button variant="primary" type="submit" block value="Sign In">
                            Sign Up
            </Button>
                    </Form>
                    <br></br>
                    <p className="text-center"> or </p>
                    <Button
                        className="text-centre"
                        variant="outline-secondary"
                        href="/login"
                        block
                    >
                        Login
          </Button>
                </Container>
            </div>
        );
    }
}

export default CreateAccount;
