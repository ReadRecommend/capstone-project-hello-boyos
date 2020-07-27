import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import Error from "./components/Error";
import AdminAddBook from "./pages/Admin/AdminAddBook";
import AdminBookList from "./pages/Admin/AdminBookList";
import UserHome from "./pages/UserHome";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Logout from "./pages/Logout";
import UserPage from "./pages/UserPage";
import GoalPage from "./pages/Goals/GoalPage";

import BookPage from "./pages/BookPage";
import Search from "./pages/Search";
import UserSearch from "./pages/UserSearch";

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
                        path="/admin/addBook"
                        component={AdminAddBook}
                        roles={["admin"]}
                        key="adminAddBook"
                    />
                    <PrivateRoute
                        exact
                        path="/admin/bookList"
                        component={AdminBookList}
                        roles={["admin"]}
                        key="adminBookList"
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
                        path="/book/:bookID"
                        component={BookPage}
                        roles={["everyone"]}
                        key="bookPage"
                    />
                    <PrivateRoute
                        exact
                        path="/search"
                        component={Search}
                        roles={["user"]}
                        key="search"
                    />
                    <PrivateRoute
                        exact
                        path="/usrsearch"
                        component={UserSearch}
                        roles={["user"]}
                        key="userSearch"
                    />
                    <PrivateRoute
                        exact
                        path="/goals"
                        component={GoalPage}
                        roles={["user"]}
                        key="goalPage"
                    />
                    <Route
                        path="*"
                        key="404"
                        component={() => (
                            <Error
                                errorCode="404"
                                errorMessage="Sorry, the page you are looking for does not exist"
                            ></Error>
                        )}
                    ></Route>
                </Switch>
            </div>
        );
    }
}

export default Main;
