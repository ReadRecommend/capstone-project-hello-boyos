import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Logout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            access_token: ''
        };
    }

    componentDidMount() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        this.props.history.push('/');
    }

    render() {
        return (
            <p>logging you out...</p>
        )
    }
}

Logout.propTypes = {
    login: PropTypes.func.isRequired
}

export default Logout;