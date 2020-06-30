import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import UserHome from './pages/UserHome';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Logout from './pages/Logout';

class Main extends Component {
    render() {
        return (
            <Switch> {/* The Switch decides which component to show based on the current URL.*/}
                < Route exact path='/' render={(props) => <UserHome {...props} username={this.props.username} accessToken={this.props.accessToken} />} />
                < Route exact path='/login' render={(props) => <Login {...props} handleUser={this.props.handleUser} />} />
                < Route exact path='/createAccount' component={CreateAccount} />
                < Route exact path='/logout' render={(props) => <Logout {...props} username={this.props.username} accessToken={this.props.accessToken} handleLogout={this.props.handleLogout} />} />
                {/* Example route:
            <Route exact path='/signup' component={Signup}></Route> */}
            </Switch >
        );
    }
}

Main.propTypes = {
    handleUser: PropTypes.func.isRequired,
    handleLogout: PropTypes.func.isRequired
}

export default Main;