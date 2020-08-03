import React, { Component } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { Cookies } from "react-cookie";
import { loginContext } from "../../LoginContext";
import { toast } from "react-toastify";

import { logIn } from "../../fetchFunctions";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
    }

    componentDidMount() {
        if (
            this.props.location.state &&
            this.props.location.state.newAccount === true
        ) {
            toast.success(
                "Successfully created your account! Please try to login now"
            );
        }
    }

    updateUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    updatePassword = (event) => {
        this.setState({ password: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.state.username || !this.state.password) {
            toast.error("Please fill in the correct fields");
            return;
        }

        logIn(this.state.username, this.state.password)
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

                let role = "User";
                if (json.roles.search("admin") !== -1) {
                    role = "Admin";
                }

                // Set our logged in role in localstorage
                // NOTE this is purely for the nav bar, so a user can change it and it will confuse
                // the nav bar, but that is it. It won't make you admin/an admin a user
                localStorage.setItem("loggedInRole", role);

                // Perhaps a bit hacky, but the context will be the function that tells the navbar we have logged in
                this.context();
                // Change route to home
                return this.props.history.push("/");
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
        return (
            <div className="Login">
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
            </div>
        );
    }
}

// We need this for this.context to work
Login.contextType = loginContext;

export default Login;
