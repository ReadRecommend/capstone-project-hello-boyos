import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import Admin from "./pages/Admin";
import UserHome from "./pages/UserHome";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Logout from "./pages/Logout";

class Main extends Component {
    render() {
        return (
            <div>
                <Switch>
                    {" "}
                    {/* The Switch decides which component to show based on the current URL.*/}
                    <PrivateRoute
                        exact
                        path="/"
                        component={Home}
                        roles={["user", "admin"]}
                        key="home"
                    />
                    <PrivateRoute
                        exact
                        path="/home"
                        component={UserHome}
                        roles={["user"]}
                        key="userHome"
                    />
                    <PrivateRoute
                        exact
                        path="/admin"
                        component={Admin}
                        roles={["admin"]}
                        key="admin"
                    />
                    <PrivateRoute
                        exact
                        path="/login"
                        component={Login}
                        roles={["everyone"]}
                        key="login"
                        handleLogin={this.props.handleLogin}
                    />
                    <PrivateRoute
                        exact
                        path="/createAccount"
                        component={CreateAccount}
                        roles={["everyone"]}
                        key="createAccount"
                    />
                    <PrivateRoute
                        exact
                        path="/logout"
                        component={Logout}
                        roles={["everyone"]}
                        key="logout"
                        handleLogout={this.props.handleLogout}
                    />
                    <Route exact path='/404' key="404">
                        <h1>404 Page not found</h1>
                    </Route>
                    <Route exact path='/403' key="403">
                        <h1>403 Access Forbidden</h1>
                    </Route>
                    {/* Example route:
            <Route exact path='/signup' component={Signup}></Route> */}
                </Switch>
            </div>
        );
    }
}

export default Main;
