import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: "No token" });
  const token = header.split(" ")[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.user = await User.findById(data.id).select("-passwordHash");
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}
