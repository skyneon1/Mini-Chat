import express from "express";
import Channel from "../models/Channel.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const channels = await Channel.find().populate("members", "username");
  res.json(channels);
});

router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  const channel = await Channel.create({ name, members: [req.user._id] });
  res.json(channel);
});

router.post("/:id/join", auth, async (req, res) => {
  const ch = await Channel.findById(req.params.id);
  if (!ch) return res.status(404).json({ msg: "Channel not found" });
  if (!ch.members.includes(req.user._id)) ch.members.push(req.user._id);
  await ch.save();
  res.json(ch);
});

router.post("/:id/leave", auth, async (req, res) => {
  const ch = await Channel.findById(req.params.id);
  if (!ch) return res.status(404).json({ msg: "Channel not found" });
  ch.members = ch.members.filter(m => m.toString() !== req.user._id.toString());
  await ch.save();
  res.json(ch);
});

export default router;
