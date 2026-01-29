// vehicles.routes.js
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

/* ADD VEHICLE */
router.post("/", protectRoute, async (req, res) => {
  const { vehicle_number, vehicle_type } = req.body;
  if (!vehicle_number || !vehicle_type)
    return res.status(400).json({ message: "All fields required" });

  const vehicle = await Vehicle.create({
    user_id: req.user.user_id,
    vehicle_number,
    vehicle_type,
  });

  res.status(201).json(vehicle);
});

/* LIST VEHICLES */
router.get("/", protectRoute, async (req, res) => {
  const vehicles = await Vehicle.findAll({
    where: { user_id: req.user.user_id },
  });
  res.json(vehicles);
});

/* UPDATE VEHICLE */
router.patch("/:id", protectRoute, async (req, res) => {
  const updated = await Vehicle.update(req.body, {
    where: { vehicle_id: req.params.id, user_id: req.user.user_id },
  });
  if (!updated[0])
    return res.status(404).json({ message: "Vehicle not found" });

  res.json({ message: "Vehicle updated" });
});

/* DELETE VEHICLE */
router.delete("/:id", protectRoute, async (req, res) => {
  const deleted = await Vehicle.destroy({
    where: { vehicle_id: req.params.id, user_id: req.user.user_id },
  });
  if (!deleted)
    return res.status(404).json({ message: "Vehicle not found" });

  res.json({ message: "Vehicle deleted" });
});

export default router;
