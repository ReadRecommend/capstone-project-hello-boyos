import React, { Component } from "react";
import { Alert } from "react-bootstrap";

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
        console.log(this.state.username);
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
        fetch("http://localhost:5000/createaccount", {
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
            .catch((e) => {});
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

                <h1>Create Account</h1>
                <p>This is the page for creating an account.</p>
                <form method="POST" onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={this.updateUsername}
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.updateEmail}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.updatePassword}
                    />
                    {/* For confirming password (add later)
					<input
						type="password"
						name="password-confim"
						placeholder="Confirm Password"
						value={this.state.password_confirm}
						onChange={this.updatePasswordConfirm}
					/>*/}
                    <input
                        type="submit"
                        value="Create Account"
                        className="btn"
                    />
                </form>
            </div>
        );
    }
}

export default CreateAccount;
