import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {

        if (roles.includes("everyone")) {
            return <Component {...props} />
        }

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
                return res.json

            })
            .then((json) => {

                const user = json;

                // Check if our role has access to this page
                let allowedAccess = false;
                for (const role of user.roles) {
                    if (this.props.roles.indexOf(role) !== -1) {
                        allowedAccess = true;
                    }
                }

                if (allowedAccess === false) {
                    // Not authorised
                    return <Redirect to={{ pathname: '/login' }} />
                } else {
                    // Authorised
                    return <Component {...props} />
                }

            })
            .catch((error) => {
                // Something wrong with the cookie, logout
                return <Redirect to={{ pathname: '/logout' }} />
            });

        /*if (!currentUser) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        // check if route is restricted by role
        if (roles && roles.indexOf(currentUser.role) === -1) {
            // role not authorised so redirect to home page
            return <Redirect to={{ pathname: '/'}} />
        }
        // authorised so return component
        return <Component {...props} />
        */
    }} />
)

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

export default PrivateRoute;