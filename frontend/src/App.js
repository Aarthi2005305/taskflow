import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Tasks from "./components/Tasks";
import Profile from "./components/Profile";

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "tasks" : "login"
  );

  const handleLogin = () => {
    setPage("tasks");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  return (
    <div>
      {page === "login" && (
        <Login
          onLogin={handleLogin}
          goToRegister={() => setPage("register")}
        />
      )}
      {page === "register" && (
        <Register goToLogin={() => setPage("login")} />
      )}
      {page === "tasks" && (
        <Tasks
          onLogout={handleLogout}
          goToProfile={() => setPage("profile")}
        />
      )}
      {page === "profile" && (
        <Profile goBack={() => setPage("tasks")} />
      )}
    </div>
  );
}

export default App;