// alerts.routes.js
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import Alert from "../models/Alert.js";
import Accident from "../models/Accident.js";

const router = express.Router();

/* LIST USER ALERTS */
router.get("/", protectRoute, async (req, res) => {
  const alerts = await Alert.findAll({
    include: {
      model: Accident,
      where: { user_id: req.user.user_id },
    },
  });
  res.json(alerts);
});

/* ALERTS BY ACCIDENT */
router.get("/:accidentId", protectRoute, async (req, res) => {
  const alerts = await Alert.findAll({
    where: { accident_id: req.params.accidentId },
  });
  res.json(alerts);
});

export default router;
