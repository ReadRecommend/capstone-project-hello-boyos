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

import BookPage from "./pages/BookPage";
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
                        path="/user/:userId"
                        component={UserPage}
                        roles={["everyone"]}
                        key="user"
                    />
                    <Route
                        exact
                        path="/createAccount"
                        component={CreateAccount}
                        key="createAccount"
                    />
                    <Route exact path="/login" component={Login} key="login" />
                    <Route
                        exact
                        path="/logout"
                        component={Logout}
                        key="logout"
                    />
                    <PrivateRoute
                        exact
                        path="/user/:userId"
                        component={UserPage}
                        roles={["user"]}
                        key="user"
                    />
                    <PrivateRoute
                        exact
                        path="/book/:bookISBN"
                        component={BookPage}
                        roles={["everyone"]}
                        key="bookPage"
                    />


                    <PrivateRoute
                        exact
                        path="/book/:bookID/reviews"
                        component={Reviews}
                        roles={["everyone"]}
                        key="reviews"
                    />
                    <PrivateRoute
                        exact
                        path="/book/:bookID/addreview"
                        component={AddReview}
                        roles={["user"]}
                        key="addreview"
                    />

                    <Route exact path="*" key="404">
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
