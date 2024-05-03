import React from "react";
import "./App.css";
import Sidebar from "./Components/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import TodoToday from "./Pages/TodoToday";
import TodoUpComing from "./Pages/TodoUpComing";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import { useTodoContext } from "./Context/TodoContext";
import NotFound from "./Pages/NotFound";
import NotAuthenticated from "./Pages/NotAuthenticated";

function App() {
  const { isLogIn } = useTodoContext();

  return (
    <Router>
      {isLogIn ? <Sidebar /> : null}
      <Routes>
        {!isLogIn ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotAuthenticated />} />
          </>
        ) : (
          <>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/todoToday" element={<TodoToday />} />
            <Route path="/todoUpcoming" element={<TodoUpComing />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
