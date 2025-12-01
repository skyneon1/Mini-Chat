import React, { useState, useEffect } from "react";
import axios from "./api/axios";
import Login from "./pages/Login";
import ChatPage from "./pages/ChatPage";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else localStorage.removeItem("token");
  }, [token]);

  if (!token) {
    return <Login onLogin={(t,u) => { setToken(t); setUser(u); localStorage.setItem("user", JSON.stringify(u)); }} />
  }

  return <ChatPage token={token} user={user} />;
}
