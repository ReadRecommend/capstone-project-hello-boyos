import React, { Component } from 'react';
import { Cookies } from 'react-cookie';
import { loginContext } from '../LoginContext';

class Logout extends Component {
    componentDidMount() {
        let cookie = new Cookies();
        cookie.remove("accessToken");
        localStorage.removeItem("loggedInRole");
        // Perhaps a bit hacky, but the context will be the function that tells the navbar we have logged out
        this.context();
        this.props.history.push('/login');
    }

    render() {
        return (
            <p>logging you out...</p>
        )
    }
}

// We need this for this.context to work
Logout.contextType = loginContext;

export default Logout;