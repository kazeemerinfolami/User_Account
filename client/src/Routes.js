import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import App from "./App";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import Activate from "./auth/Activate";
import Private from "./core/Private";
import PrivateRoute from "../src/auth/PrivateRoute";
import AdminRoute from "../src/auth/AdminRoute";
import Admin from "./core/Admin";
import Forgot from "./auth/Forgot";
import Reset from "./auth/Reset";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <Route path="/auth/activate/:token" exact component={Activate} />
        <PrivateRoute path="/private" exact component={Private} />
        <AdminRoute path="/admin" exact component={Admin} />
        <Route path="/auth/password/forgot" exact component={Forgot} />
        <Route path="/auth/password/reset/:token'" exact component={Reset} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
