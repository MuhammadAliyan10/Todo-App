import React, { useEffect, useState } from "react";
import "../assets/Css/Todo.css";
import { useTodoContext } from "../Context/TodoContext";
import "../assets/Css/PopUpBox.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TodoToday = () => {
  const { allList, setAllLists, todoToday, setTodoToday } = useTodoContext();
  const [todoAdded, isTodoAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBox, setShowBox] = useState(false);

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
  }, [allList]);
  useEffect(() => {
    const getTodayTodo = async () => {
      try {
        const api = "http://localhost:3000/tasks/todayTodo";
        const token = localStorage.getItem("token");
        const data = await fetch(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const todo = await data.json();
        setTodoToday(todo);
        isTodoAdded(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getTodayTodo();
  }, [todoAdded]);
  const [data, setData] = useState({
    title: "",
    list: {
      title: "",
      color: "",
    },

    type: "",
    timeStamps: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("list_value")) {
      const selectedList = JSON.parse(value);
      console.log(selectedList);
      setData((prevData) => ({
        ...prevData,
        list: selectedList,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const updatedIsCompleted = async (taskID, currentStatus) => {
    const api = `http://localhost:3000/tasks/updateCompleted/${taskID}`;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(api, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCompleted: !currentStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        isTodoAdded(!todoAdded);
        setTodoToday((prevTodo) =>
          prevTodo.map((todoItem) => {
            if (todoItem._id === taskID) {
              return { ...todoItem, isCompleted: currentStatus };
            }
            return todoItem;
          })
        );
      } else {
        return toast(data.message);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const api = `http://localhost:3000/tasks/removeTodo/${id}`;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return toast(data.message);
      }
      toast(data.message);
      isTodoAdded(true);
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddTodo = async () => {
    if (!data.title) {
      return toast("Title is required.");
    } else if (!data.type) {
      return toast("Type is required.");
    } else if (!data.list.title) {
      return toast("List title is required.");
    } else if (!data.timeStamps) {
      return toast("TimeStamps is required.");
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/tasks/addTodo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return toast("Failed to add todo");
      }
      const dataRes = await response.json();
      toast(dataRes.message);
      setShowBox(false);
      isTodoAdded(true);
      setData({
        title: "",
        list: {
          title: "",
          color: "",
        },

        type: "",
        timeStamps: "",
      });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div className="todo">
      <ToastContainer />
      <div className="container">
        <div className="todoToday">
          <h3>Today</h3>
          <div className="task__todo mt-3">
            <button
              className="create__todo"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <i className="fa-solid fa-plus"></i> Add New Task
            </button>
            <div
              class="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Add Task
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div className="box">
                      <input
                        value={data.title}
                        type="text"
                        name="title"
                        placeholder="Enter the title..."
                        onChange={(e) => onInputChange(e)}
                      />
                      <select
                        id="mySelect"
                        value={data.list.value}
                        onChange={(e) => onInputChange(e)}
                        name="list_value"
                      >
                        {allList.length > 0 ? (
                          <>
                            {allList.map((list) => {
                              return (
                                <option
                                  key={list._id}
                                  value={JSON.stringify({
                                    title: list.title,
                                    color: list.color,
                                  })}
                                >
                                  {list.title}
                                </option>
                              );
                            })}
                          </>
                        ) : (
                          <option hidden>No list found</option>
                        )}
                      </select>
                      <select
                        id="mySelect"
                        value={data.type.value}
                        onChange={(e) => onInputChange(e)}
                        name="type"
                      >
                        <option hidden>Enter the type...</option>
                        <option value="Todo">Todo</option>
                        <option value="Reminder">Reminder</option>
                        <option value="Desire">Desire</option>
                      </select>

                      <select
                        id="mySelect"
                        value={data.timeStamps}
                        onChange={(e) => onInputChange(e)}
                        name="timeStamps"
                      >
                        <option hidden>Enter the time.</option>
                        <option value="Today" defaultChecked>
                          Today
                        </option>
                        <option value="Tomorrow" disabled>
                          Tomorrow
                        </option>
                        <option value="nextWeek" disabled>
                          Next Week
                        </option>
                      </select>
                      <div className="box__buttons"></div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <div className="box__buttons">
                      <button onClick={handleAddTodo}>Add</button>
                      <button type="button" data-bs-dismiss="modal">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {todoToday.length > 0 ? (
              <div className="my__tasks">
                {todoToday.map((task, index) => {
                  const collapseId = `flush-collapse-${index}`;
                  const dataBsTarget = `#flush-collapse-${index}`;
                  const listColor = `${task.list["color"]}`;
                  return (
                    <div
                      className="accordion accordion-flush"
                      id="accordionFlushExample"
                      key={task._id}
                    >
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultChecked={task.isCompleted}
                            id={`checkbox-${index}`}
                            onChange={() =>
                              updatedIsCompleted(task._id, task.isCompleted)
                            }
                          />
                          {task.isCompleted ? (
                            <>
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={dataBsTarget}
                                aria-expanded="false"
                                aria-controls={collapseId}
                              >
                                <s>{task.title}</s>
                              </button>
                            </>
                          ) : (
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={dataBsTarget}
                              aria-expanded="false"
                              aria-controls={collapseId}
                            >
                              {task.title}
                            </button>
                          )}
                        </h2>
                        <div
                          id={collapseId}
                          className="accordion-collapse collapse"
                          data-bs-parent="#accordionFlushExample"
                        >
                          <div className="accordion-body">
                            <ul className="task__additional">
                              <li>
                                <i className="fa-solid fa-calendar-days"></i>
                                <p>{task.createdAt}</p>
                              </li>
                              <li>
                                <p
                                  style={{
                                    background: listColor,
                                    color: "#fff",
                                    padding: "4px 8px",
                                    borderRadius: "10px",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {task.type}
                                </p>
                              </li>
                              <li>
                                <p
                                  style={{
                                    background: listColor,
                                    color: "#fff",
                                    padding: "4px 8px",
                                    borderRadius: "10px",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {task.list.title}
                                </p>
                              </li>
                              {loading ? (
                                <p>Deleting....</p>
                              ) : (
                                <li
                                  className="deleteTodo"
                                  onClick={() => {
                                    handleDelete(task._id);
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no__todo">No Todo, Please add one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoToday;
