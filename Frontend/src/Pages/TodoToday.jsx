import React, { useEffect, useState } from "react";
import "../assets/Css/Todo.css";
import { useTodoContext } from "../Context/TodoContext";
import "../assets/Css/PopUpBox.css";
const TodoToday = () => {
  const [todoToday, setTodoToday] = useState([]);
  const [todoAdded, isTodoAdded] = useState(false);
  const [loading, setLoading] = useState(false);

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
      value: "",
    },

    type: {
      value: "",
    },
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

  const [showBox, setShowBox] = useState(false);

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
        return todoItem;
      })
    );
  };
  return (
    <div className="todo my-5">
      <div className="container">
        <div className="todoToday">
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
                  <input
                    type="text"
                    placeholder="Add your list..."
                    onChange={(e) => onInputChange(e)}
                    value={data.list.value}
                    name="list_value"
                  />
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
      </div>
    </div>
  );
};

export default TodoToday;
