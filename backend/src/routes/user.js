import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/online", auth, async (req, res) => {
  const users = await User.find().select("username online lastSeen");
  res.json(users);
});

export default router;
