import express from "express";
import Message from "../models/Message.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/send", auth, async (req, res) => {
  const { channel, text } = req.body;
  const m = await Message.create({ sender: req.user._id, channel, text });
  res.json(m);
});

router.get("/:channelId", auth, async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const messages = await Message.find({ channel: req.params.channelId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("sender", "username");
  res.json(messages);
});

export default router;
