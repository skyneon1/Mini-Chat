import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import channelRoutes from "./routes/channel.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";
import { registerSocketHandlers } from "./sockets/handler.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_ORIGIN || "*" }
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
