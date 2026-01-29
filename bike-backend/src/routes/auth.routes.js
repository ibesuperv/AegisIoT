// auth.routes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import EmergencyContact from "../models/EmergencyContact.js";
import { firebaseDB } from "../config/firebase.js";

const router = express.Router();

const formatPhone = (num) => {
  if (!/^[6-9]\d{9}$/.test(num)) return null;
  return `+91${num}`;
};

const generateToken = (id) =>
  jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "15d" });

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, mobile, contact1, contact2 } = req.body;

    if (!username || !email || !password || !mobile || !contact1 || !contact2)
      return res.status(400).json({ message: "All fields required" });

    if (username.length < 3)
      return res.status(400).json({ message: "Username too short" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password too short" });

    const m1 = formatPhone(mobile);
    const c1 = formatPhone(contact1);
    const c2 = formatPhone(contact2);
    if (!m1 || !c1 || !c2)
      return res.status(400).json({ message: "Invalid phone numbers" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const user = await User.create({
      username,
      email,
      password_hash: password,
      mobile: m1,
      profile_image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    });

    await EmergencyContact.create({
      user_id: user.user_id,
      contact1: c1,
      contact2: c2,
    });

    await firebaseDB.ref(`user/${email.replace(/\./g, "_")}`).set({
      accident: false,
      drowsy: false,
      lat: null,
      lng: null,
    });

    res.status(201).json({
      token: generateToken(user.user_id),
      user,
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user.user_id), user });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
