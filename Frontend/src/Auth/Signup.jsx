import React, { useState } from "react";
import "../assets/Css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useTodoContext } from "../Context/TodoContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Signup = () => {
  const { setIsLogIn } = useTodoContext();
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  const handleUser = async (e) => {
    e.preventDefault();
    try {
      if (!data.email || !data.password || !data.username) {
        return toast("All the fields are required.");
      } else if (data.password.length < 8) {
        return toast("Password must be at least 8 characters.");
      } else if (data.username.length < 6) {
        return toast("Username must be at least 8 characters.");
      }
      const api = "http://localhost:3000/user/signup";
      const dataApi = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (dataApi.ok) {
        toast(
          "Your account has been created successfully. Please login to continue."
        );
        navigate("/login");
      }
      setIsLogIn(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="auth">
        <div className="auth__box">
          <form>
            <h4>Sign Up</h4>
            <input
              type="text"
              placeholder="Enter your username"
              name="username"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <button className="submit__btn" onClick={handleUser}>
              Sign Up
            </button>
          </form>
          <div>
            <p>
              Already have an account, <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
