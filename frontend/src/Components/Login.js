import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import { apiUrls, baseURL, headerwithoutauth } from "../apiConfig";
import callAPI from "../apiUtils/apiCall";
import { useDispatch } from "react-redux";
import { setProfile } from "../Redux/ProfileSlice";
import { ErrorMessage, SuccessMessage } from "../Notification";

const Login = ({ setAccount }) => {
  const [credentials, setCredentials] = useState({ email: "shreya@gmail.com", password: "password" });
  const [loader, setLoader] = useState(false);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceupdate] = useState();

  const navigate = useNavigate();

  const handleCredentials = (e) => {
    setCredentials((value) => {
      return { ...value, [e.target.name]: e.target.value };
    });
  };

  const checkFormValidation = (e) => {
    e.preventDefault();
    const isValid = simpleValidator.current.allValid();
    if (!isValid) {
      simpleValidator.current.showMessages();
      forceupdate(1);
    } else handleLogin();
  };

  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const response = await callAPI(
        apiUrls.login,
        {},
        "post",
        credentials,
        headerwithoutauth
      );
      if (response?.status) {
        localStorage.setItem("user", JSON.stringify(response?.data));
        dispatch(
          setProfile({
            name: response?.data?.name,
            email: response?.data?.email,
            profilePicture: response?.data?.profilePicture,
          })
        );
        navigate("/messages");
        SuccessMessage("Logged in")
      } else {
        ErrorMessage(response.message)
      }
      setLoader(false)
    } catch (error) {
      ErrorMessage(error.message)
      setLoader(false)
    }
  };

  return (
    <div className="wrapper-container">
      <div className="wrapper">
        <h2>Login to chat</h2>
        <form onSubmit={checkFormValidation}>
          <div className="input-box">
            <input
              type="text"
              name="email"
              value={credentials?.email}
              onChange={handleCredentials}
              placeholder="Enter email"
            />
            <div className="error">
              {simpleValidator.current.message(
                "email",
                credentials?.email,
                "required"
              )}
            </div>
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              value={credentials?.password}
              onChange={handleCredentials}
              placeholder="Enter password"
            />
            <div className="error">
              {simpleValidator.current.message(
                "password",
                credentials?.password,
                "required"
              )}
            </div>
          </div>

          <div className="input-box button">
            <button type="Submit" role="button" className="loginbtn" disabled={loader}>
              {" "}
              Login
             {loader && <i
                class="fa fa-spinner fa-spin"
                style={{ marginLeft: "10px" }}></i>}
            </button>
          </div>
          <div className="text">
            <h3>
              Do not have an account?{" "}
              <Link
                onClick={() => {
                  setAccount(false);
                }}>
                Create an account
              </Link>
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
