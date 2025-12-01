import React, { useEffect, useState, useRef } from "react";
import { createSocket } from "../socket";
import api from "../api/axios";

export default function ChatPage({ token, user }) {
  const [channels, setChannels] = useState([]);
  const [current, setCurrent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = createSocket(token);
    socketRef.current.on("new-message", (m) => {
      if (m.channel === (current?._id)) setMessages(prev => [...prev, m]);
    });
    socketRef.current.on("presence-update", () => {
    });

    return () => socketRef.current.disconnect();
  }, [token, current]);

  useEffect(() => {
    loadChannels();
  }, []);

  async function loadChannels() {
    const res = await api.get("/channels");
    setChannels(res.data);
    if (res.data.length && !current) setCurrent(res.data[0]);
  }

  async function enterChannel(ch) {
    setCurrent(ch);
    setMessages([]);
    socketRef.current.emit("join-channel", ch._id);
    const res = await api.get(`/messages/${ch._id}?page=1&limit=50`);
    setMessages(res.data.slice().reverse());
  }

  async function send() {
    if (!text.trim()) return;
    const payload = { channel: current._id, text, sender: user._id };
    socketRef.current.emit("send-message", payload);
    await api.post("/messages/send", { channel: current._id, text });
    setText("");
  }

  async function createChannel() {
    const name = prompt("Channel name?");
    if (!name) return;
    const res = await api.post("/channels", { name });
    setChannels(prev => [...prev, res.data]);
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>Channels</h3>
        <button onClick={createChannel}>+ New</button>
        <ul>
          {channels.map(c => (
            <li key={c._id} className={current?._id===c._id ? 'active': ''} onClick={()=>enterChannel(c)}>
              #{c.name} ({c.members?.length||0})
            </li>
          ))}
        </ul>
      </aside>

      <main className="chat">
        <header>
          <h2>{current ? `# ${current.name}` : "Select a channel"}</h2>
        </header>

        <div className="messages">
          {messages.map(m => (
            <div key={m._id} className="message">
              <strong>{m.sender?.username || 'Unknown'}</strong>
              <div>{m.text}</div>
              <small>{new Date(m.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>

        {current && <footer className="composer">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Message..." />
          <button onClick={send}>Send</button>
        </footer>}
      </main>
    </div>
  );
}
