// emergencyContacts.routes.js
import express from "express";
import protectRoute from "../middleware/auth.middleware.js";
import EmergencyContact from "../models/EmergencyContact.js";

const router = express.Router();

/* GET CONTACTS */
router.get("/", protectRoute, async (req, res) => {
  const contacts = await EmergencyContact.findOne({
    where: { user_id: req.user.user_id },
  });
  res.json(contacts);
});

/* UPDATE CONTACTS */
router.patch("/", protectRoute, async (req, res) => {
  const { contact1, contact2 } = req.body;

  if (
    (contact1 && !/^[6-9]\d{9}$/.test(contact1)) ||
    (contact2 && !/^[6-9]\d{9}$/.test(contact2))
  )
    return res.status(400).json({ message: "Invalid contact number" });

  const contacts = await EmergencyContact.findOne({
    where: { user_id: req.user.user_id },
  });

  if (contact1) contacts.contact1 = `+91${contact1}`;
  if (contact2) contacts.contact2 = `+91${contact2}`;

  await contacts.save();
  res.json(contacts);
});

export default router;
