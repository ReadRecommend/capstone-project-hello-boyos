import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

import './Login.css'

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: '',
			access_token: '',
			errorShow: false,
			errorMessage: ""
		};
	}

	updateUsername = (event) => {
		this.setState({ username: event.target.value });
	}

	updatePassword = (event) => {
		this.setState({ password: event.target.value });
	}

	// Function that makes the error not show
	handleError() {
		this.setState({ errorShow: false, errorMessage: "" })
	};

	handleSubmit = (event) => {
		event.preventDefault();
		if (!this.state.username || !this.state.password) {
			this.setState({ errorShow: true, errorMessage: "Please fill in the required fields" });
			return;
		}

		const data = { username: this.state.username, password: this.state.password }
		fetch('http://localhost:5000/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		})
			.then(res => {
				if (!res.ok) {
					return res.text().then(text => { throw Error(text) });
				}

				return res.json()
			}).then(json => {
				this.props.handleUser(data.username, json.access_token);
				// Change route to home
				return this.props.history.push("/");
			})
			.catch((error) => {
				console.log(error.message)
				this.setState({ errorShow: true, errorMessage: error.message });
			});
	}

	render() {
		return (
			<div className="Login">

				{/* Alert for general problems */}
				<Alert show={this.state.errorShow} onClose={() => this.handleError()} variant="danger" dismissible>
					{this.state.errorMessage}
				</Alert>

				<h1>Login</h1>
				<p>This is the page for logging in.</p>
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
					<input
						type="submit"
						value="Sign In"
						className="btn"
					/>
				</form>
			</div>
		);
	}
}

Login.propTypes = {
	handleUser: PropTypes.func.isRequired
}

export default Login;