// users.routes.js
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import EmergencyContact from "../models/EmergencyContact.js";

const router = express.Router();

/* GET PROFILE */
router.get("/me", protectRoute, async (req, res) => {
  const user = await User.findByPk(req.user.user_id, {
    include: EmergencyContact,
  });
  res.json(user);
});

/* UPDATE PROFILE */
router.patch("/me", protectRoute, async (req, res) => {
  const { username, mobile } = req.body;

  if (username && username.length < 3)
    return res.status(400).json({ message: "Username too short" });

  if (mobile && !/^[6-9]\d{9}$/.test(mobile))
    return res.status(400).json({ message: "Invalid mobile" });

  if (username) req.user.username = username;
  if (mobile) req.user.mobile = `+91${mobile}`;

  await req.user.save();
  res.json(req.user);
});

/* DELETE ACCOUNT */
router.delete("/me", protectRoute, async (req, res) => {
  await User.destroy({ where: { user_id: req.user.user_id } });
  res.json({ message: "Account deleted" });
});

export default router;
