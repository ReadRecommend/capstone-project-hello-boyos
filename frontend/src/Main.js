import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import PrivateRoute from "./components/Auth/PrivateRoute";
import ErrorPage from "./components/General/ErrorPage";
import AdminAddBook from "./pages/Admin/AdminAddBook";
import AdminBookList from "./pages/Admin/AdminBookList";
import AdminUserList from "./pages/Admin/AdminUserList";
import UserHome from "./pages/Home/UserHome";
import Home from "./pages/Home/Home";
import Login from "./pages/Account/Login";
import CreateAccount from "./pages/Account/CreateAccount";
import Logout from "./pages/Account/Logout";
import UserPage from "./pages/Users/UserPage";
import GoalPage from "./pages/Goals/GoalPage";

import BookPage from "./pages/Books/BookPage";
import BookSearch from "./pages/Search/BookSearch";
import UserSearch from "./pages/Search/UserSearch";
import Discover from "./pages/Recommendation/Discover";
import { toast } from "react-toastify";

class Main extends Component {
    notifyError(message) {
        toast.error(message);
    }

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
                        roles={["user", "admin", "everyone"]}
                        key="home"
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/home"
                        component={UserHome}
                        roles={["user"]}
                        key="userHome"
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/admin/addBook"
                        component={AdminAddBook}
                        roles={["admin"]}
                        key="adminAddBook"
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/admin/bookList"
                        component={AdminBookList}
                        roles={["admin"]}
                        key="adminBookList"
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/admin/userList"
                        component={AdminUserList}
                        roles={["admin"]}
                        key="adminUserList"
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/user/:userId"
                        component={UserPage}
                        roles={["everyone"]}
                        key="user"
                        notifyError={this.notifyError}
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
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/search"
                        component={BookSearch}
                        roles={["user", "everyone"]}
                        key="search"
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/usrsearch"
                        component={UserSearch}
                        roles={["user", "everyone"]}
                        key="userSearch"
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/goals"
                        component={GoalPage}
                        roles={["user"]}
                        key="goalPage"
                        notifyError={this.notifyError}
                    />
                    <PrivateRoute
                        exact
                        path="/discover"
                        component={Discover}
                        roles={["user", "everyone"]}
                        key="discover"
                        notifyError={this.notifyError}
                    />
                    <Route exact path="*" key="404">
                        <h1>404 Page not found</h1>
                    </Route>
                    <Route
                        path="*"
                        key="404"
                        component={() => (
                            <ErrorPage
                                errorCode="404"
                                errorMessage="Sorry, the page you are looking for does not exist"
                            ></ErrorPage>
                        )}
                    ></Route>
                </Switch>
            </div>
        );
    }
}

export default Main;
