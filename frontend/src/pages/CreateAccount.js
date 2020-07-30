import React, { Component } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Redirect } from "react-router";

import { createAccount } from "../fetchFunctions";

class CreateAccount extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            password: "",
            done: false,
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

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.state.username || !this.state.email || !this.state.password) {
            toast.error("Please fill in the required fields");
            return;
        }

        createAccount(
            this.state.username,
            this.state.email,
            this.state.password
        )
            .then((res) => {
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                return res.json();
            })
            .then(() => {
                // Change route to login
                this.setState({ done: true });
            })
            .catch((error) => {
                // An error occurred
                let errorMessage = "Something went wrong...";
                try {
                    errorMessage = JSON.parse(error.message).message;
                } catch {
                    errorMessage = error.message;
                } finally {
                    toast.error(errorMessage);
                }
            });
    };

    render() {
        if (this.state.done === false) {
            return (
                <div className="CreateAccount">
                    <ToastContainer
                        autoClose={4000}
                        pauseOnHover
                        closeOnClick
                    />

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
        } else {
            // We created the account, pass a message to the login screen
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { newAccount: true },
                    }}
                />
            );
        }
    }
}

export default CreateAccount;
