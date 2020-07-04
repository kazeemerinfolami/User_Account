import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken"
import Layout from "../core/Layout";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Reset = ({ match }) => {
  const [values, setValues] = useState({
      name: "",
      token: "",
      newPassword: "",
    buttonText: "Reset password",
  });
    
    const {name, }
    
    useEffect(() => {
        let token = match.params.token
        let { name } = jwt.decode(token)
        if (token) {
            setValues({...values, [name]: event.target.value})
        }
    },[])
  const { email, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "submitting" });
    console.log("password corrected");
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    })
      .then((response) => {
        console.log("forgot password successful", response);
        toast.success(response.data.message);
        setValues({ ...values, buttonText: "Requested" });
      })
      .catch((error) => {
        //console.log("forgot password Error", error.response.data);
        setValues({ ...values, buttonText: "submit" });
        toast.error(error.response.data.error);
      });
  };

  const passwordResetForm = () => {
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
        <h1 className="p-5 text-center">Reset Password</h1>
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export default Reset;

//     cookie(response, () => {
//
//       //toast.success(`Hey ${response.data.user.name}, Welcome Back!`);
//       setValues({
//         //save the response/ user information(userName & token) in local storage/ cookie.
//         ...values,
//         name: "",
//         email: "",
//         password: "",
//         buttonText: "submitted",
//       });
//       toast.success(`Hey ${response.data.user.name}, Welcome Back!`);

//       cookieChecked() && cookieChecked().role === "admin"
//         ? history.push("/admin")
//         : history.push("/private");
//     });
