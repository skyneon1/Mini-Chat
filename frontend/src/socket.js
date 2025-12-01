import { io } from "socket.io-client";
export function createSocket(token) {
  return io(import.meta.env.VITE_BACKEND_URL || "http://localhost:8000", {
    auth: { token },
    transports: ["websocket"]
  });
}
