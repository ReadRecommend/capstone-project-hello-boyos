import React from "react";
import { Route, Redirect } from "react-router-dom";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ component: Component, auth, username, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) =>
                auth !== null ? (
                    <Component
                        {...props}
                        username={username}
                        accessToken={auth}
                    />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
}

export default PrivateRoute;
