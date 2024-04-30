import React, { useEffect, useState } from "react";
import "../assets/Css/Todo.css";
import { useTodoContext } from "../Context/TodoContext";
const TodoUpComing = () => {
  const {
    todoNextWeek,
    setTodoNextWeek,
    allList,
    setAllLists,
    todoToday,
    setTodoToday,
    todoTomorrow,
    setTodoTomorrow,
  } = useTodoContext();
  const [showBox, setShowBox] = useState(false);
  const [todoAdded, isTodoAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

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
      value: "",
    },

    type: {
      value: "",
    },
    timeStamps: "",
    isCompleted: isTaskCompleted,
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("list")) {
      const listKey = name.split("_")[1];
      setData((prevData) => ({
        ...prevData,
        list: {
          ...prevData.list,
          [listKey]: value,
        },
      }));
    } else if (name.startsWith("type")) {
      const typeKey = name.split("_")[1];
      setData((prevData) => ({
        ...prevData,
        type: {
          ...prevData.type,
          [typeKey]: value,
        },
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
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      isTodoAdded(true);
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddTodo = async () => {
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
        throw new Error("Failed to add todo");
      }
      setShowBox(false);
      isTodoAdded(true);
      setData({
        title: "",
        list: {
          value: "",
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
  const handleTaskCompleted = (taskID) => {
    setTodoToday((prevTodo) =>
      prevTodo.map((todoItem) => {
        if (todoItem._id === taskID) {
          return { ...todoItem, isCompleted: !todoItem.isCompleted };
        }
        setIsTaskCompleted(true);
        return todoItem;
      })
    );
  };

  return (
    <div className="todo my-5">
      <div className="container">
        <div className="today__task">
          <h3>Today</h3>
          <div className="task__todo mt-3">
            <button className="create__todo" onClick={() => setShowBox(true)}>
              <i className="fa-solid fa-plus"></i> Add New Task
            </button>
            <div className="background">
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
                              <option value={list.title}>{list.title}</option>
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
                    name="type_value"
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
                    <option hidden>Enter the time...</option>
                    <option value="Today" disabled>
                      Today
                    </option>
                    <option value="Tomorrow" defaultChecked>
                      Tomorrow
                    </option>
                    <option value="nextWeek" disabled>
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
                  const collapseId = `flush-collapse-${index}`;
                  const dataBsTarget = `#flush-collapse-${index}`;
                  const typeColor = `${task.type[0]["color"]}`;
                  const listColor = `${task.list[0]["color"]}`;
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
                            onChange={() => handleTaskCompleted(task._id)}
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
                                    background: typeColor,
                                    color: "#fff",
                                    padding: "4px 8px",
                                    borderRadius: "10px",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {task.type[0].value}
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
                                  {task.list[0].value}
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
                    onClick={() => setShowBox(true)}
                  >
                    <i className="fa-solid fa-plus"></i> Add New Task
                  </button>
                  <div className="background">
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
                                    <option value={list.title}>
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
                          name="type_value"
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
                          <option hidden>Enter the time...</option>
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
                        <div className="box__buttons">
                          <button onClick={handleAddTodo}>Add</button>
                          <button onClick={() => setShowBox(false)}>
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {todoTomorrow.length > 0 ? (
                    <div className="my__tasks">
                      {todoTomorrow.map((task, index) => {
                        const collapseId = `flush-collapse-${index}`;
                        const dataBsTarget = `#flush-collapse-${index}`;
                        const typeColor = `${task.type[0]["color"]}`;
                        const listColor = `${task.list[0]["color"]}`;
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
                                  onChange={() => handleTaskCompleted(task._id)}
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
                                          background: typeColor,
                                          color: "#fff",
                                          padding: "4px 8px",
                                          borderRadius: "10px",
                                          fontSize: "10px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {task.type[0].value}
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
                                        {task.list[0].value}
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
                    onClick={() => setShowBox(true)}
                  >
                    <i className="fa-solid fa-plus"></i> Add New Task
                  </button>
                  <div className="background">
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
                                    <option value={list.title}>
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
                          name="type_value"
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
                          <option hidden>Enter the time...</option>
                          <option value="Today" disabled>
                            Today
                          </option>
                          <option value="Tomorrow" disabled>
                            Tomorrow
                          </option>
                          <option value="nextWeek" defaultChecked>
                            Next Week
                          </option>
                        </select>
                        <div className="box__buttons">
                          <button onClick={handleAddTodo}>Add</button>
                          <button onClick={() => setShowBox(false)}>
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {todoNextWeek.length > 0 ? (
                    <div className="my__tasks">
                      {todoNextWeek.map((task, index) => {
                        const collapseId = `flush-collapse-${index}`;
                        const dataBsTarget = `#flush-collapse-${index}`;
                        const typeColor = `${task.type[0]["color"]}`;
                        const listColor = `${task.list[0]["color"]}`;
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
                                  onChange={() => handleTaskCompleted(task._id)}
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
                                          background: typeColor,
                                          color: "#fff",
                                          padding: "4px 8px",
                                          borderRadius: "10px",
                                          fontSize: "10px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {task.type[0].value}
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
                                        {task.list[0].value}
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
