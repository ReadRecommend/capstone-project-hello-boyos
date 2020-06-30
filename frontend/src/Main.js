import React from 'react';
import { Switch, Route } from 'react-router-dom';

import UserHome from './pages/UserHome';
import Login from './pages/Login';

const Main = () => {
    return (
        <Switch> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path='/' component={UserHome}></Route>
            <Route exact path='/login' render={(props) => <Login {...props} handleUser={this.props.handleUser} />} />
            {/* Example route:
            <Route exact path='/signup' component={Signup}></Route> */}
        </Switch>
    );
}

export default Main;