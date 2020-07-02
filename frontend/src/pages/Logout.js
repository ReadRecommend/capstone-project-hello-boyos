import React, { Component } from 'react';
import { Cookies } from 'react-cookie';

class Logout extends Component {
    componentDidMount() {
        let cookie = new Cookies();
        cookie.remove("accessToken");
        this.props.history.push('/login');
    }

    render() {
        return (
            <p>logging you out...</p>
        )
    }
}


export default Logout;