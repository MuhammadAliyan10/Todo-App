import React, { createContext, useContext, useEffect, useState } from "react";

const TodoContext = createContext();

export const useTodoContext = () => {
  return useContext(TodoContext);
};

const TodoProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogIn(token !== null);
  }, [isLogIn]);

  const todoContextValue = {
    userList,
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
