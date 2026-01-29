// accidents.routes.js
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import Accident from "../models/Accident.js";
import Alert from "../models/Alert.js";

const router = express.Router();

/* CREATE ACCIDENT */
router.post("/", protectRoute, async (req, res) => {
  const { latitude, longitude } = req.body;
  if (latitude == null || longitude == null)
    return res.status(400).json({ message: "Location required" });

  const accident = await Accident.create({
    user_id: req.user.user_id,
    latitude,
    longitude,
  });

  res.status(201).json(accident);
});

/* LIST ACCIDENTS */
router.get("/", protectRoute, async (req, res) => {
  const accidents = await Accident.findAll({
    where: { user_id: req.user.user_id },
    include: Alert,
  });
  res.json(accidents);
});

/* RESOLVE ACCIDENT */
router.patch("/:id", protectRoute, async (req, res) => {
  const updated = await Accident.update(
    { status: "RESOLVED" },
    { where: { accident_id: req.params.id, user_id: req.user.user_id } }
  );

  if (!updated[0])
    return res.status(404).json({ message: "Accident not found" });

  res.json({ message: "Accident resolved" });
});

export default router;
