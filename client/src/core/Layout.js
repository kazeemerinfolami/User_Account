import React, { Fragment, useLayoutEffect } from "react";
import { Link, withRouter } from "react-router-dom";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#000" };
    } else {
      return { color: "#fff" };
    }
  };

  const nav = () => (
    <ul className="nav nav-tabs bg-dark">
      <li className="nav-items">
        <Link to="/" className=" nav-link" style={isActive("/")}>
          Home
        </Link>
      </li>
      <li className="nav-items">
        <Link to="/signin" className=" nav-link" style={isActive("/signin")}>
          SignIn
        </Link>
      </li>
      <li className="nav-items">
        <Link to="/signup" className=" nav-link" style={isActive("/signup")}>
          Signup
        </Link>
      </li>
    </ul>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
