import React, { Component } from 'react';
import {Cookies} from 'react-cookie';
import PropTypes from 'prop-types';

class Logout extends Component {
    componentDidMount() {
        let cookie = new Cookies();
        cookie.remove("accessToken");
        this.props.history.push('/');
    }

    render() {
        return (
            <p>logging you out...</p>
        )
    }
}

Logout.propTypes = {
    handleLogout: PropTypes.func.isRequired
}

export default Logout;