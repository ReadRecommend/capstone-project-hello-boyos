import React from "react";
import { Route, Redirect } from "react-router-dom";

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

                alert(json)

            }) 
            .catch((error) => {
                alert(error.message)
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

export default PrivateRoute;
