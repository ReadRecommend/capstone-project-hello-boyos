import React, { Component } from 'react';

import './Login.css'

class CreateAccount extends Component {
	constructor(props) {
		super(props)
		this.state = { username: '', email: '', password: '', password_confirm: ''};
	}

	updateUsername = (event) => {
		this.setState({ username: event.target.value });
	}

	updateEmail = (event) => {
		this.setState({ email: event.target.value });
	}

	updatePassword = (event) => {
		this.setState({ password: event.target.value });
	}

	updatePasswordConfirm = (event) => {
		this.setState({ password_confirm: event.target.value });
	}

	handleSubmit = (event) => {
		event.preventDefault();
		const data = { username: this.state.username, email: this.state.email, password: this.state.password, }
		fetch('http://localhost:5000/createaccount', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8'
			}
		}).then(res => {
			return res.json()
		}).then(json => {
			//this.props.handleUser(data.username, json.access_token);
		});
	}

	render() {
		return (
			<div className="CreateAccount">
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
					<input
						type="password"
						name="password-confim"
						placeholder="Confirm Password"
						value={this.state.password_confirm}
						onChange={this.updatePasswordConfirm}
					/>
					<input
						type="submit"
						value="Create Account"
						className="btn"
					/>
				</form>
			</div>
		)
	}
}

export default CreateAccount;