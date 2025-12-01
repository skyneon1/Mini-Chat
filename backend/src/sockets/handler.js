import User from "../models/User.js";
import jwt from "jsonwebtoken";

const socketUser = new Map();

export function registerSocketHandlers(io) {
  io.on("connection", async (socket) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    let userId = null;
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
      userId = data.id;
      socketUser.set(socket.id, userId);
      await User.findByIdAndUpdate(userId, { online: true });
      io.emit("presence-update");
    } catch (err) {
      console.log("Socket auth failed");
    }

    socket.on("join-channel", (channelId) => {
      if (!channelId) return;
      socket.join(channelId);
    });

    socket.on("send-message", async (payload) => {
      try {
        const Message = (await import("../models/Message.js")).default;
        const m = await Message.create({
          sender: payload.sender,
          channel: payload.channel,
          text: payload.text
        });
        const messageToEmit = await m.populate("sender", "username");
        io.to(payload.channel).emit("new-message", messageToEmit);
      } catch (err) {
        console.error("send-message error", err);
      }
    });

    socket.on("disconnect", async () => {
      const uid = socketUser.get(socket.id);
      socketUser.delete(socket.id);
      if (uid) {
        await User.findByIdAndUpdate(uid, { online: false, lastSeen: new Date() });
        io.emit("presence-update");
      }
    });
  });
}
