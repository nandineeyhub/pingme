import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import { apiUrls, baseURL } from "../apiConfig";
import axios from "axios";
import { ErrorMessage, SuccessMessage } from "../Notification";

const Registration = ({ setAccount }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceupdate] = useState();
  const [loader, setLoader] = useState(false);
  const handleFormData = (e) => {
    setFormData((value) => {
      return { ...value, [e.target.name]: e.target.value };
    });
  };

  const checkFormValidation = async (e) => {
    e.preventDefault();
    const isValid = simpleValidator.current.allValid();
    if (!isValid) {
      simpleValidator.current.showMessages();
      forceupdate(1);
    } else handleRegistration();
  };

  const header = {
    "Content-Type": "application/json",
  };

  const handleRegistration = async () => {
    setLoader(true)
    try {
      let data = formData;
      delete data["confirmPassword"];
      const response = await axios.post(
        baseURL + apiUrls.register,
        data,
        header
      );
      if (response.data.status) {
        setLoader(false)
        SuccessMessage(response.message);
        setAccount(true);
      } else ErrorMessage(response.message);
  
    } catch (error) {
      setLoader(false)
      ErrorMessage(error.message)
    }
  };

  return (
    <div className="wrapper-container">
      <div className="wrapper">
        <h2>Create an account</h2>
        <form onSubmit={checkFormValidation}>
          <div className="input-box">
            <input
              type="text"
              name="name"
              value={formData?.name}
              onChange={handleFormData}
              placeholder="Enter name"
            />
            <div className="error">
              {simpleValidator.current.message(
                "name",
                formData?.name,
                "required"
              )}
            </div>
          </div>
          <div className="input-box">
            <input
              type="text"
              name="email"
              value={formData?.email}
              onChange={handleFormData}
              placeholder="Enter email"
            />
            <div className="error">
              {simpleValidator.current.message(
                "email",
                formData?.email,
                "required"
              )}
            </div>
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              value={formData?.password}
              onChange={handleFormData}
              placeholder="Create password"
            />
            <div className="error">
              {simpleValidator.current.message(
                "password",
                formData?.password,
                "required"
              )}
            </div>
          </div>
          <div className="input-box">
            <input
              type="password"
              name="confirmPassword"
              value={formData?.confirmPassword}
              onChange={handleFormData}
              placeholder="Confirm password"
            />
            <div className="error">
              {simpleValidator.current.message(
                "password confirmation",
                formData?.confirmPassword,
                `required|in:${formData?.password}`
              )}
            </div>
          </div>
          <div className="input-box button">
          <button type="Submit" role="button" className="loginbtn">
           
              Register now
             {loader && <i
                class="fa fa-spinner fa-spin"
                style={{ marginLeft: "10px" }}></i>}
            </button>
          </div>
          <div className="text">
            <h3>
              Already have an account?{" "}
              <Link
                onClick={() => {
                  setAccount(true);
                }}>
                Login
              </Link>{" "}
            </h3>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
