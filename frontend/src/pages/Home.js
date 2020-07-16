import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import PropTypes from 'prop-types';

class Home extends Component {
    render() {
        if (this.props.initialUserInfo.roles.includes("admin")) {
            return (<Redirect to="/admin/removeBook" />);
        } else {
            return (<Redirect to="/home" />);
        }
    }
}

Home.propTypes = {
    initialUserInfo: PropTypes.object.isRequired
}

export default Home;