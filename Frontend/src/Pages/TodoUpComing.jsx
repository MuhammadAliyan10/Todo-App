import React, { useEffect, useState } from "react";
import "../assets/Css/Todo.css";
import { useTodoContext } from "../Context/TodoContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TodoUpComing = () => {
  const {
    todoNextWeek,
    setTodoNextWeek,
    allList,
    todoToday,
    setTodoToday,
    todoTomorrow,
    setTodoTomorrow,
  } = useTodoContext();
  const [showBox, setShowBox] = useState(false);
  const [todoAdded, isTodoAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState("");

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
        if (!data.ok) {
          return toast(todo.message);
        }
        setTodoToday(todo);
        isTodoAdded(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const getTomorrowTodo = async () => {
      try {
        const api = "http://localhost:3000/tasks/tomorrowTodo";
        const token = localStorage.getItem("token");
        const data = await fetch(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const todo = await data.json();
        if (!data.ok) {
          return toast(todo.message);
        }
        setTodoTomorrow(todo);
        isTodoAdded(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const getNextWeekTodo = async () => {
      try {
        const api = "http://localhost:3000/tasks/nextWeekTodo";
        const token = localStorage.getItem("token");
        const data = await fetch(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const todo = await data.json();
        if (!data.ok) {
          return toast(todo.message);
        }
        setTodoNextWeek(todo);
        isTodoAdded(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getNextWeekTodo();
    getTomorrowTodo();
    getTodayTodo();
  }, [todoAdded]);
  const [data, setData] = useState({
    title: "",
    list: {
      title: "",
      color: "",
    },

    type: {
      value: "",
    },
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
      isTodoAdded(true);
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const showBoxHandler = (time) => {
    setTime(time);
    setShowBox(true);
    setData({
      title: "",
      list: {
        title: "",
        color: "",
      },

      type: {
        value: "",
      },
      timeStamps: "",
    });
  };
  const handleAddTodo = async () => {
    if (!data) {
      return toast("All the fields are required.");
    } else if (!data.title) {
      return toast("Title is required.");
    } else if (!data.type) {
      return toast("Type is required.");
    } else if (!data.list.title) {
      return toast("List title is required.");
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
      const resData = await response.json();
      if (!response.ok) {
        return toast(resData.message);
      }
      toast(resData.message);
      setShowBox(false);
      isTodoAdded(true);
      setData({
        title: "",
        list: {
          title: "",
          color: "",
        },

        type: {
          value: "",
        },
        timeStamps: "",
      });
    } catch (error) {
      console.error("Error adding todo:", error);
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
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="todo my-5">
      <ToastContainer />
      <div className="container">
        <div className="today__task">
          <h3>Today</h3>
          <div className="task__todo mt-3">
            <button
              className="create__todo"
              onClick={() => showBoxHandler("Today")}
            >
              <i className="fa-solid fa-plus"></i> Add New Task
            </button>
            <div className="background2">
              {showBox && (
                <div className="box">
                  <h4>Add Task</h4>
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
                            <>
                              <option hidden>Select the list...</option>
                              <option
                                value={JSON.stringify({
                                  title: list.title,
                                  color: list.color,
                                })}
                              >
                                {list.title}
                              </option>
                            </>
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
                    <option
                      value="Today"
                      disabled={time == "Tomorrow" || time == "nextWeek"}
                    >
                      Today
                    </option>
                    <option
                      value="Tomorrow"
                      disabled={time == "Today" || time == "nextWeek"}
                    >
                      Tomorrow
                    </option>
                    <option
                      value="nextWeek"
                      disabled={time == "Today" || time == "Tomorrow"}
                    >
                      Next Week
                    </option>
                  </select>
                  <div className="box__buttons">
                    <button onClick={handleAddTodo}>Add</button>
                    <button onClick={() => setShowBox(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
            {todoToday.length > 0 ? (
              <div className="my__tasks">
                {todoToday.map((task, index) => {
                  const collapseId = `flush-collapse-${task._id}`;
                  const dataBsTarget = `#flush-collapse-${task._id}`;

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
        <div className="next__task my-4">
          <div className="row">
            <div className="col-sm-7">
              <div className="tomorrow__tasks">
                <h3>Tomorrow</h3>
                <div className="task__todo mt-3">
                  <button
                    className="create__todo"
                    onClick={() => showBoxHandler("Tomorrow")}
                  >
                    <i className="fa-solid fa-plus"></i> Add New Task
                  </button>
                  {todoTomorrow.length > 0 ? (
                    <div className="my__tasks">
                      {todoTomorrow.map((task, index) => {
                        const collapseId = `flush-collapse-${index + 1}`;
                        const dataBsTarget = `#flush-collapse-${index + 1}`;

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
                                    updatedIsCompleted(
                                      task._id,
                                      task.isCompleted
                                    )
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
            <div className="col-sm-5">
              <div className="weekly__tasks">
                <h3>Weekly</h3>
                <div className="task__todo mt-3">
                  <button
                    className="create__todo"
                    onClick={() => showBoxHandler("nextWeek")}
                  >
                    <i className="fa-solid fa-plus"></i> Add New Task
                  </button>

                  {todoNextWeek.length > 0 ? (
                    <div className="my__tasks">
                      {todoNextWeek.map((task, index) => {
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
                                    updatedIsCompleted(
                                      task._id,
                                      task.isCompleted
                                    )
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
        </div>
      </div>
    </div>
  );
};

export default TodoUpComing;
