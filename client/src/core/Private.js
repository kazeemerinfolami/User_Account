import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { cookieChecked, getCookie, signOut } from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

//user can to view their profile and edit, and automatically after login it will be updated form the database
const Private = ({ history }) => {
  const [values, setValues] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    buttonText: "update",
  });
  //to get user/ client info to be automatically visible after a user login and visit him profile
  const token = getCookie("token");
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${cookieChecked()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("private Profile update", response);
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        console.log("private profile error", error.response.data.error);
        if (error.response.status === 401) {
          signOut(() => {
            history.push("/");
          });
        }
      });
  };
  const { role, name, email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  }; // where client can make an update ini is account profile
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "updating" });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/user/update`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { name, password },
    })
      .then((response) => {
        console.log("private profile update", response);
        setValues({
          ...values,
          buttonText: "updated",
        });
        toast.success("Profile updated successfully");
      })
      .catch((error) => {
        console.log("private, profile update Error", error.response.data.error);
        setValues({ ...values, buttonText: "update" });
        toast.error(error.response.data.error);
      });
  };

  const updateForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Role</label>
          <input
            defaultValue={role}
            type="text"
            className="form-control"
            disabled
          ></input>
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={handleChange("name")}
            value={name}
            type="text"
            className="form-control"
          ></input>
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            defaultValue={email}
            type="email"
            className="form-control"
            disabled
          ></input>
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={handleChange("password")}
            value={password}
            type="password"
            className="form-control"
            placeholder="password must be 8 characters long"
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
      <div className=" col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="pt-5 text-center">Private</h1>
        <p className="p-5 text-center">Profile update</p>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Private;
