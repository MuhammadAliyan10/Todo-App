import React, { useState } from "react";
import "../assets/Css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useTodoContext } from "../Context/TodoContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const navigate = useNavigate();
  const { setIsLogIn } = useTodoContext();
  const [data, setData] = useState({ email: "", password: "" });
  const onChangeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    if (!data) {
      return toast("Please enter your email or password.");
    }
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.status == 200) {
        localStorage.setItem("token", res.token);
        setIsLogIn(true);
        navigate("/");
      } else {
        return toast(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="auth">
        <div className="auth__box">
          <form onSubmit={handleSubmit}>
            <h4>Log In</h4>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              onChange={onChangeHandler}
            />
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={onChangeHandler}
            />
            <button className="submit__btn">Login</button>
          </form>
          <div>
            <p>
              Don't have any account.<Link to="/signup">Sign Up</Link> for free
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
