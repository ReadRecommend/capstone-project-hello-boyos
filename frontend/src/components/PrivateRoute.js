import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { verifyUser } from "../fetchFunctions";
import Error from "./Error";
import PropTypes from "prop-types";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated when trying to access a protected page
class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            haveAccess: false,
            brokenCookie: false,
            userInfo: {},
        };
    }

    componentDidMount() {
        this.authorisation(this.props.roles);
    }

    authorisation = (roles) => {
        verifyUser()
            .then((res) => {
                // An error occurred
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                // We are a valid user
                return res.json();
            })
            .then((json) => {
                const user = json;
                localStorage.setItem("loggedIn", "true");

                // Check if our role has access to this page
                let allowedAccess = false;
                for (const role of user.roles) {
                    if (roles.indexOf(role) !== -1) {
                        allowedAccess = true;
                    }
                }

                if (allowedAccess === false) {
                    // Not authorised
                    this.setState({
                        loading: false,
                        haveAccess: false,
                        userInfo: user,
                    });
                } else {
                    // Authorised
                    this.setState({
                        loading: false,
                        haveAccess: true,
                        userInfo: user,
                    });
                }
            })
            .catch((error) => {
                // Something wrong with the cookie/it's missing
                this.setState({
                    loading: false,
                    haveAccess: false,
                    userInfo: null,
                    brokenCookie: true,
                });
            });
    };

    render() {
        const { component: Component, ...rest } = this.props;
        if (this.state.loading) {
            // While we are loading the user info, display loading
            return (
                <>
                    {/* <Container> */}
                    <Spinner
                        animation="border"
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                        }}
                    />
                    {/* </Container> */}
                </>
            );
        } else if (this.props.roles.includes("everyone")) {
            // Everyone is allowed on this page, so let them through regardless.
            // If the user was logged in their info will be in initialUserInfo, otherwise, it will be null
            return (
                <Route
                    {...rest}
                    render={(props) => (
                        <div>
                            <Component
                                {...props}
                                initialUserInfo={this.state.userInfo}
                            />
                        </div>
                    )}
                />
            );
        } else if (this.state.brokenCookie) {
            this.props.notifyError(
                "Your session has expired. Please log in again"
            );
            // Cookie is broken/missing, so logout
            return <Redirect to="/logout" />;
        } else if (!this.state.haveAccess) {
            // If we don't have access display 403
            return (
                <Error
                    errorCode={403}
                    errorMessage="Sorry, it looks like you don't have the correct authorisation to access this page"
                ></Error>
            );
        } else {
            return (
                <Route
                    {...rest}
                    render={(props) => (
                        <div>
                            {/* Otherwise we load the page normally*/}
                            <Component
                                {...props}
                                initialUserInfo={this.state.userInfo}
                            />
                        </div>
                    )}
                />
            );
        }
    }
}

PrivateRoute.propTypes = {
    notifyError: PropTypes.func.isRequired,
};

export default PrivateRoute;
