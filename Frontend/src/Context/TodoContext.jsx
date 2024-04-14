import React, { createContext, useContext, useEffect, useState } from "react";

const TodoContext = createContext();

export const useTodoContext = () => {
  return useContext(TodoContext);
};

const TodoProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [isLogIn, setIsLogIn] = useState(
    localStorage.getItem("isLogIn") === "true"
  );
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
  });
  useEffect(() => {
    localStorage.setItem("isLogIn", isLogIn);
  }, [isLogIn]);

  const todoContextValue = {
    userList,
    isLogIn,
    setIsLogIn,
    userInfo,
    setUserInfo,
  };
  return (
    <TodoContext.Provider value={todoContextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
