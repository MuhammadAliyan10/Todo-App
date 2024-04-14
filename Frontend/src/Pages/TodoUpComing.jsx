import React from "react";
import "../assets/Css/Todo.css";
import { useTodoContext } from "../Context/TodoContext";
const TodoUpComing = () => {
  const { todoToday, setTodoToday } = useTodoContext();
  const handleTaskCompleted = (taskTitle) => {
    setTodoToday((prevTodo) =>
      prevTodo.map((todoItem) => {
        if (todoItem.title === taskTitle) {
          return { ...todoItem, isCompleted: !todoItem.isCompleted };
        }
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
            <button className="create__todo">
              <i className="fa-solid fa-plus"></i> Add New Task
            </button>
            {todoToday.length > 0 ? (
              <div className="my__tasks">
                {todoToday.map((task, index) => {
                  const collapseId = `flush-collapse-${index}`;
                  const dataBsTarget = `#flush-collapse-${index}`;
                  return (
                    <div
                      className="accordion accordion-flush"
                      id="accordionFlushExample"
                      key={task.title}
                    >
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultChecked={task.isCompleted}
                            id={`checkbox-${index}`}
                            onChange={() => handleTaskCompleted(task.title)}
                          />
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
                                <p>{task.timeStamps}</p>
                              </li>
                              <li>
                                <p
                                  style={{
                                    background: `${task.list["color"]}`,
                                    color: "#fff",
                                    padding: "4px 8px",
                                    borderRadius: "10px",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {task.type["value"]}
                                </p>
                              </li>
                              <li>
                                <p
                                  style={{
                                    background: `${task.list["color"]}`,
                                    color: "#fff",
                                    padding: "4px 8px",
                                    borderRadius: "10px",
                                    fontSize: "10px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {task.list["value"]}
                                </p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No Todo, Please add one.</p>
            )}
          </div>
        </div>
        <div className="next__task my-4">
          <div className="row">
            <div className="col-sm-7">
              <div className="tomorrow__tasks">
                <h3>Tomorrow</h3>
                <div className="task__todo mt-3">
                  <button className="create__todo">
                    <i className="fa-solid fa-plus"></i> Add New Task
                  </button>
                  {todoToday.length > 0 ? (
                    <div className="my__tasks">
                      {todoToday.map((task, index) => {
                        const collapseId = `flush-collapse-${index}`;
                        const dataBsTarget = `#flush-collapse-${index}`;
                        return (
                          <div
                            className="accordion accordion-flush"
                            id="accordionFlushExample"
                            key={task.title}
                          >
                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  defaultChecked={task.isCompleted}
                                  id={`checkbox-${index}`}
                                  onChange={() =>
                                    handleTaskCompleted(task.title)
                                  }
                                />
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
                                      <p>{task.timeStamps}</p>
                                    </li>
                                    <li>
                                      <p
                                        style={{
                                          background: `${task.list["color"]}`,
                                          color: "#fff",
                                          padding: "4px 8px",
                                          borderRadius: "10px",
                                          fontSize: "10px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {task.type["value"]}
                                      </p>
                                    </li>
                                    <li>
                                      <p
                                        style={{
                                          background: `${task.list["color"]}`,
                                          color: "#fff",
                                          padding: "4px 8px",
                                          borderRadius: "10px",
                                          fontSize: "10px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {task.list["value"]}
                                      </p>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No Todo, Please add one.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-sm-5">
              <div className="weekly__tasks">
                <h3>Weekly</h3>
                <div className="task__todo mt-3">
                  <button className="create__todo">
                    <i className="fa-solid fa-plus"></i> Add New Task
                  </button>
                  {todoToday.length > 0 ? (
                    <div className="my__tasks">
                      {todoToday.map((task, index) => {
                        const collapseId = `flush-collapse-${index}`;
                        const dataBsTarget = `#flush-collapse-${index}`;
                        return (
                          <div
                            className="accordion accordion-flush"
                            id="accordionFlushExample"
                            key={task.title}
                          >
                            <div className="accordion-item">
                              <h2 className="accordion-header">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  defaultChecked={task.isCompleted}
                                  id={`checkbox-${index}`}
                                  onChange={() =>
                                    handleTaskCompleted(task.title)
                                  }
                                />
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
                                      <p>{task.timeStamps}</p>
                                    </li>
                                    <li>
                                      <p
                                        style={{
                                          background: `${task.list["color"]}`,
                                          color: "#fff",
                                          padding: "4px 8px",
                                          borderRadius: "10px",
                                          fontSize: "10px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {task.type["value"]}
                                      </p>
                                    </li>
                                    <li>
                                      <p
                                        style={{
                                          background: `${task.list["color"]}`,
                                          color: "#fff",
                                          padding: "4px 8px",
                                          borderRadius: "10px",
                                          fontSize: "10px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        {task.list["value"]}
                                      </p>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No Todo, Please add one.</p>
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
