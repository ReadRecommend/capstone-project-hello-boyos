import React from 'react'

import './Login.css'

function Login() {
	return (
		<React.Fragment>
			<h1>Sign In</h1>
			<p>This is the page for signing in.</p>
			<form>
				<input
					type="text"
					name="username"
					placeholder="Username"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
				/>
				<input
					type="submit"
					value="Sign In"
					className="btn"
				/>
			</form>
		</React.Fragment>
	)
}

export default Login;