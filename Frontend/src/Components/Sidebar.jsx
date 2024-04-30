import React, { useEffect, useState } from "react";
import "../assets/Css/Sidebar.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTodoContext } from "../Context/TodoContext";
import "../assets/Css/PopUpBox.css";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { setIsLogIn, allList, setAllLists } = useTodoContext();
  const [list, setList] = useState({ title: "", color: "" });
  const [listChanged, setListChanged] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLogIn(false);
    navigate("/login");
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
    } catch (error) {
      console.log(error);
    }
  };
  const handleListAdd = async () => {
    const api = "http://localhost:3000/tasks/addList";
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(api, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(list),
      });
      console.log(list);
      setListChanged(true);
      setShowBox(false);
      const res = await data.json();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  const onInputChange = (e) => {
    setList((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
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
          <div className="background">
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
                <div className="box__buttons">
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
