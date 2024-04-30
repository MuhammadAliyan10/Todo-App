import React, { createContext, useContext, useEffect, useState } from "react";

const TodoContext = createContext();

export const useTodoContext = () => {
  return useContext(TodoContext);
};

const TodoProvider = ({ children }) => {
  const [allList, setAllLists] = useState([]);
  const [todoToday, setTodoToday] = useState([]);
  const [todoTomorrow, setTodoTomorrow] = useState([]);
  const [todoNextWeek, setTodoNextWeek] = useState([]);
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogIn(token !== null);
  }, [isLogIn]);

  const todoContextValue = {
    todoNextWeek,
    setTodoNextWeek,
    todoTomorrow,
    setTodoTomorrow,
    todoToday,
    setTodoToday,
    allList,
    setAllLists,
    isLogIn,
    setIsLogIn,
  };
  return (
    <TodoContext.Provider value={todoContextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
