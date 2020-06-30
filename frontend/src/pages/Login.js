import React, { Component } from 'react';

import './Login.css'

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {username: '', password: '', access_token: ''};

		this.updateUsername = this.updateUsername.bind(this);
		this.updatePassword = this.updatePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	updateUsername(event) {
		this.setState({username: event.target.value});
	}

	updatePassword(event) {
		this.setState({password: event.target.value});
	}


	handleSubmit(event) {
		event.preventDefault();
		fetch('http://localhost:5000/login', {
			method: 'POST',
			body: JSON.stringify(this.state),
			headers : {
				'Content-type': 'application/json; charset=UTF-8'
			}
		}).then(res => {
			return res.json()
		}).then(json => {
			this.setState(json);
			//console.log(this.props.handleUser)
			//this.props.handleUser(this.state.username, this.state.access_token);
			this.props.handleUser.bind(this, this.state.username, this.state.access_token);
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

export default Login;