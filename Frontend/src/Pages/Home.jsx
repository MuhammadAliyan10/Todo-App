import React, { useEffect, useState } from "react";
import "../assets/Css/Home.css";
import HomeImage from "../assets/Images/todo_home.png";

const Home = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/user/getUser", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUser({ username: data.username, email: user.email });
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="Home">
      <div className="container__fluid">
        <div className="top__header">
          <h3>Home</h3>
          <h4>
            Welcome, <span>{user.username}</span>
          </h4>
        </div>
        <div className="middle__header">
          <div className="row">
            <div className="col-sm-6">
              <div className="left_info">
                <h3>
                  Task
                  <br /> Management
                </h3>
                <p>
                  Make a business plan or list of resolution to achieve goal or
                  achieve success.
                </p>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="middle_image">
                <img src={HomeImage} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
