import React from 'react'

import './Login.css'

function CreateAccount() {
	return (
		<React.Fragment>
			<h1>Sign Up</h1>
			<p>This is the page for signing up.</p>
			<form>
				<input
					type="text"
					name="firstName"
					placeholder="First name"
				/>
				<input
					type="text"
					name="lastName"
					placeholder="Last name"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
				/>
				<input
					type="submit"
					value="Sign Up"
					className="btn"
				/>
			</form>
		</React.Fragment>
	)
}

export default CreateAccount;