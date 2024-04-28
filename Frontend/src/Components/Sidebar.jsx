import React from "react";
import "../assets/Css/Sidebar.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTodoContext } from "../Context/TodoContext";
const Sidebar = () => {
  const { pathname } = useLocation();
  const { userList, setIsLogIn } = useTodoContext();
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLogIn(false);
    navigate("/login");
  };
  return (
    <div>
      <div className="sidebar">
        <h4 className="sidebar__header">Tasks</h4>

        <ul>
          <li>
            <Link to="/" className={pathname == "/" ? "active" : ""}>
              <i className="fa-solid fa-house"></i>
              <p>Home</p>
            </Link>
          </li>
          <li>
            <Link
              to="/todoToday"
              className={pathname == "/todoToday" ? "active" : ""}
            >
              <i className="fa-solid fa-list-check"></i>
              <p>Today</p>
            </Link>
          </li>
          <li>
            <Link
              to="/todoUpComing"
              className={pathname == "/todoUpComing" ? "active" : ""}
            >
              <i className="fa-solid fa-angles-right"></i>
              <p>Upcoming</p>
            </Link>
          </li>
        </ul>

        <div className="lists">
          <h4 className="sidebar__header">Lists</h4>
          <ul>
            {userList.length > 0 ? (
              <li>
                <a href="">
                  <span className="sidebar__list__box"></span>
                  <p>List 1</p>
                </a>
              </li>
            ) : (
              <button className="create__list">
                <i className="fa-solid fa-plus"></i> Add New List
              </button>
            )}
          </ul>
        </div>

        <div className="profile-contact">
          <h4 className="sidebar__header">User</h4>

          <ul>
            <li>
              <Link to="/contact">
                <i className="fa-solid fa-address-book"></i>
                <p>Contact</p>
              </Link>
            </li>
            <li>
              <a href="" onClick={handleSignOut}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <p>Sign out</p>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
