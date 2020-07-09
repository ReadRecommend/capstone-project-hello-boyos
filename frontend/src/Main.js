import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import Admin from "./pages/Admin";
import UserHome from "./pages/UserHome";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Logout from "./pages/Logout";
import UserPage from "./pages/UserPage";
import Reviews from "./pages/Reviews";
import AddReview from "./pages/AddReview";

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
                    />
                    <PrivateRoute
                        exact
                        path="/user/:userId"
                        component={UserPage}
                        roles={["user"]}
                        key="user"
                    />
                    {/* TODO: Change these to private routes after auth fix */}
                    <Route
                        exact
                        path="/book/:bookID/reviews"
                        component={Reviews}
                    />
                    <Route
                        exact
                        path="/book/:bookID/addreview"
                        component={AddReview}
                    />
                    <Route exact path='*' key="404">
                        <h1>404 Page not found</h1>
                    </Route>
                    {/* Example route:
            <Route exact path='/signup' component={Signup}></Route> */}
                </Switch>
            </div>
        );
    }
}

export default Main;
