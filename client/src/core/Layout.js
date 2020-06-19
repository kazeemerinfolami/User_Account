import React, { Fragment, useLayoutEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { signOut, cookieChecked } from "../auth/helpers";

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#000" };
    } else {
      return { color: "#CACE9F" };
    }
  };

  const nav = () => (
    <ul className=" nav nav-tabs bg-dark">
      <li className="nav-items">
        <Link to="/" className=" nav-link" style={isActive("/")}>
          Home
        </Link>
      </li>
      {!cookieChecked() && (
        <Fragment>
          <li className="nav-item">
            <Link
              to="/signin"
              className=" nav-link"
              color="OA32OE"
              style={(isActive("/signin"), { color: "#206A28" })}
            >
              SignIn
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/signup"
              className=" nav-link"
              style={isActive("/signup")}
            >
              Signup
            </Link>
          </li>
        </Fragment>
      )}

      {cookieChecked() && (
        <li className="nav-item">
          <span
            className="nav-link"
            style={{
              cursor: "pointer",
              color: "#CACE9F",
              backgroundColor: "#24282A",
            }}
          >
            {cookieChecked().name}
          </span>
        </li>
      )}

      {cookieChecked() && (
        <li className="nav-item">
          {/* <Link to="/signin" className=" nav-link" style={isActive("/signin")}> */}
          <span
            className="nav-link"
            style={{ cursor: "not-allowed", color: "#6A0707" }}
            onClick={() => {
              signOut(() => {
                history.push("/");
              });
            }}
          >
            SignOut
          </span>
          {/* </Link> */}
        </li>
      )}
    </ul>
  );

  return (
    <Fragment>
      <div className="bg-dark">
        {nav()}
        <div className="container ">{children}</div>
      </div>
    </Fragment>
  );
};

export default withRouter(Layout);
