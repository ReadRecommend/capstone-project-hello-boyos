import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
class PrivateRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            haveAccess: false,
            brokenCookie: false,
            userInfo: {}
        };
    }

    componentDidMount() {
        // If everyone can access this page, no need to check authorisation
        if (!this.props.roles.includes("everyone")) {
            this.authorisation(this.props.roles);
        }
    }

    authorisation = (roles) => {
        fetch("http://localhost:5000/verify", {
            method: "GET",
            credentials: "include"
        })
            .then((res) => {

                // An error occurred
                if (!res.ok) {
                    return res.text().then((text) => {
                        throw Error(text);
                    });
                }

                // We are a valid user
                return res.json()

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
                    this.setState({ loading: false, haveAccess: false, userInfo: user });
                } else {
                    // Authorised
                    this.setState({ loading: false, haveAccess: true, userInfo: user });
                }

                console.log(this.state.userInfo)

            })
            .catch((error) => {
                console.log(error.message)
                // Something wrong with the cookie/it's missing, logout
                this.setState({ loading: false, haveAccess: false, brokenCookie: true });
            });
    }

    render() {
        const { component: Component, ...rest } = this.props;
        if (this.props.roles.includes("everyone")) {
            /* Everyone is allowed on this page so don't do any authentication */
            return (
                <Route {...rest} render={props => (
                    <div>
                        <Component {...props} />
                    </div>
                )}
                />
            );
        }
        else if (this.state.loading) {
            // While we are loading the user info, display loading 
            return <h1>LOADING...</h1>;
        } else if (this.state.brokenCookie) {
            // Cookie is broken/missing, so logout
            return <Redirect to="/logout" />;
        }
        else if (!this.state.haveAccess) {
            // If we don't have access display 403
            return (<h1>403 Forbidden</h1>);
        } else {
            return (
                <Route {...rest} render={props => (
                    <div>
                        {/* Otherwise we load the page normally*/}
                        <Component {...props} initialUserInfo={this.state.userInfo} />
                    </div>
                )}
                />
            );
        }
    }

}


export default PrivateRoute;
