import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ msg: "Missing fields" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "Email already used" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash: hash });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "devsecret");
  res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ msg: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "devsecret");
  res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
});

export default router;
