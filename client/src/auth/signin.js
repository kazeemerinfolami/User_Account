import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { cookie } from "./helpers";
import "react-toastify/dist/ReactToastify.min.css";

const Signin = () => {
  const [values, setValues] = useState({
    email: "erinfolasmikazeem@gmail.com",
    password: "kkkzzz",
    buttonText: "submit",
  });
  const { name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "submitting" });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((response) => {
        cookie(response, () => {
          console.log("signin successful");
          setValues({
            //save the response/ user information(userName & token) in local storage/ cookie.
            ...values,
            name: "",
            email: "",
            password: "",
            buttonText: "submitted",
          });
          toast.success(`Hey ${response.data.user.name}, Welcome Back!`);
        });
      })
      .catch((error) => {
        // console.log("Signin Error", error.response.data);
        setValues({ ...values, buttonText: "submit" });
        toast.error(error.response.data.error);
      });
  };

  const signinForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            onChange={handleChange("email")}
            value={email}
            type="email"
            className="form-control"
          ></input>
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={handleChange("password")}
            value={password}
            type="password"
            className="form-control"
          ></input>
        </div>
        <div>
          <button className="btn btn-dark" onClick={clickSubmit}>
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {/* {cookieChecked() ? <Redirect to="/" /> : null} */}
        <h1 className="p-5 text-center">Signin</h1>
        {signinForm()}
      </div>
    </Layout>
  );
};

export default Signin;
