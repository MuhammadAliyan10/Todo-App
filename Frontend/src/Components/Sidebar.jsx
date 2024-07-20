import React, { useEffect, useState } from "react";
import "../assets/Css/Sidebar.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTodoContext } from "../Context/TodoContext";
import "../assets/Css/PopUpBox.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { setIsLogIn, allList, setAllLists } = useTodoContext();
  const [list, setList] = useState({ title: "", color: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [listChanged, setListChanged] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLogIn(false);
    navigate("/login");
  };

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsSmallScreen(window.innerWidth <= 1200);
    };
    checkScreenWidth();
    if (isSmallScreen) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(false);
    }
  }, [isSmallScreen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleClick = () => {
    if (isSmallScreen) {
      setIsOpen(!isOpen);
    }
  };
  useEffect(() => {
    const getAllList = async () => {
      const api = "http://localhost:3000/tasks/getLists";
      const token = localStorage.getItem("token");
      const data = await fetch(api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await data.json();
      if (!data.ok) {
        return toast(res.message);
      }
      setAllLists(res);
    };
    getAllList();
  }, [listChanged]);

  const handleListDelete = async (id) => {
    const token = localStorage.getItem("token");
    const api = `http://localhost:3000/tasks/removeList/${id}`;
    try {
      const data = await fetch(api, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListChanged(true);
      const res = await data.json();
      if (!data.ok) {
        return toast(res.message);
      }
      toast(res.message);
    } catch (error) {
      console.log(error);
    }
  };
  const handleListAdd = async () => {
    const api = "http://localhost:3000/tasks/addList";
    const token = localStorage.getItem("token");
    if (!list.title) {
      return toast("Title is required");
    } else if (!list.color) {
      return toast("Color is required");
    }
    try {
      const data = await fetch(api, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(list),
      });

      setListChanged(true);
      setShowBox(false);
      const res = await data.json();
      if (!data.ok) {
        return toast(res.message);
      }
      toast(res.message);
    } catch (error) {
      console.error(error);
    }
  };
  const onInputChange = (e) => {
    setList((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };
  return (
    <div>
      <ToastContainer />
      <div className={`sidebar ${isOpen ? "close" : ""}`}>
        <h4 className="sidebar__header">Tasks</h4>

        <ul>
          <li>
            <Link
              to="/"
              className={pathname == "/" ? "active" : ""}
              onClick={handleClick}
            >
              <i className="fa-solid fa-house"></i>
              <p>Home</p>
            </Link>
          </li>
          <li>
            <Link
              to="/todoToday"
              className={pathname == "/todoToday" ? "active" : ""}
              onClick={handleClick}
            >
              <i className="fa-solid fa-list-check"></i>
              <p>Today</p>
            </Link>
          </li>
          <li>
            <Link
              onClick={handleClick}
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
            {allList.length > 0 ? (
              allList.map((list) => {
                return (
                  <div key={list._id}>
                    <li className="lists__user">
                      <a href="">
                        <span
                          className="sidebar__list__box"
                          style={{ backgroundColor: list.color }}
                        ></span>
                        <p>{list.title}</p>
                      </a>

                      <i
                        className="fa-solid fa-trash"
                        onClick={() => {
                          handleListDelete(list._id);
                        }}
                      ></i>
                    </li>
                  </div>
                );
              })
            ) : (
              <>
                <p className="no__list">No List Found</p>
              </>
            )}
          </ul>
          <div className="add_list_parent">
            {showBox && (
              <div className="box__list">
                <h4>Add List</h4>
                <input
                  type="text"
                  placeholder="Enter your list name..."
                  onChange={(e) => onInputChange(e)}
                  name="title"
                  autoComplete="off"
                />
                <div className="color__input">
                  <p>Select the color:</p>
                  <input
                    type="color"
                    className="color__field"
                    name="color"
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
                <div className="box__buttons" style={{ float: "right" }}>
                  <button onClick={handleListAdd}>Add</button>
                  <button onClick={() => setShowBox(false)}>Close</button>
                </div>
              </div>
            )}
          </div>
          <button className="create__list" onClick={() => setShowBox(true)}>
            <i className="fa-solid fa-plus"></i> Add New List
          </button>
        </div>

        <div className="profile-contact">
          <h4 className="sidebar__header">User</h4>

          <ul>
            <li>
              <a href="" onClick={handleSignOut}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <p>Sign out</p>
              </a>
            </li>
          </ul>
        </div>
        {isSmallScreen && (
          <div className="toggleBtn">
            <button onClick={toggleSidebar}>
              {isOpen ? (
                <i className="fa-solid fa-door-open"></i>
              ) : (
                <i className="fa-solid fa-door-closed"></i>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
