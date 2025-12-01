import React, { useState } from "react";
import axios from "../api/axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      const url = isSignup ? "/auth/signup" : "/auth/login";
      const res = await axios.post(url, isSignup ? { email, password, username } : { email, password });
      onLogin(res.data.token, res.data.user);
    } catch (err) {
      alert(err?.response?.data?.msg || "Auth error");
    }
  }

  return (
    <div className="center">
      <form onSubmit={submit} className="card">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        {isSignup && <input placeholder='username' value={username} onChange={e=>setUsername(e.target.value)} />}
        <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">{isSignup ? "Sign up" : "Login"}</button>
        <button type="button" onClick={()=>setIsSignup(s=>!s)} className="link">
          {isSignup ? "Have account? Login" : "No account? Sign up"}
        </button>
      </form>
    </div>
  );
}
