import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Login.css'

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = { username: '', password: '', access_token: '' };
	}

	updateUsername = (event) => {
		this.setState({ username: event.target.value });
	}

	updatePassword = (event) => {
		this.setState({ password: event.target.value });
	}


	handleSubmit = (event) => {
		event.preventDefault();
		const data = { username: this.state.username, password: this.state.password }
		fetch('http://localhost:5000/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		}).then(res => {
			return res.json()
		}).then(json => {
			this.props.handleUser(data.username, json.access_token);
		});
	}

	render() {
		return (
			<div className="Login">
				<h1>Login</h1>
				<p>This is the page for logging in.</p>
				<form method="POST" onSubmit={this.handleSubmit}>
					<input
						type="text"
						name="username"
						placeholder="Username"
						value={this.state.username}
						onChange={this.updateUsername}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						value={this.state.password}
						onChange={this.updatePassword}
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