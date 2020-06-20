import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { cookieChecked } from "./helpers";

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      cookieChecked() && cookieChecked().role === "admin" ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/signin", state: { from: props.location } }}
        />
      )
    }
  ></Route>
);

export default AdminRoute;
