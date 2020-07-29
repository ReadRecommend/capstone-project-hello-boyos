import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import WebFont from "webfontloader";

WebFont.load({
    google: {
        families: ["Abril Fatface", "cursive"],
    },
});

ReactDOM.render(
    <BrowserRouter>
        <App />{" "}
        {/* The various pages will be displayed by the `Main` component. */}
    </BrowserRouter>,
    document.getElementById("root")
);
