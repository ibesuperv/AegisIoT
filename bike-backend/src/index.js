// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

/* ---------------- CONFIG ---------------- */
dotenv.config();

/* ---------------- DB ---------------- */
import { connectDB } from "./lib/db.js";

/* ---------------- ROUTES ---------------- */
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import emergencyContactsRoutes from "./routes/emergencyContacts.routes.js";
import vehiclesRoutes from "./routes/vehicles.routes.js";
import accidentsRoutes from "./routes/accidents.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";

/* ---------------- BACKGROUND JOBS ---------------- */
import job from "./lib/cron.js";
import "./lib/accidentAlertWorker.js"; // Firebase listener (side-effect import)

/* ---------------- APP INIT ---------------- */
const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- ROUTE REGISTRATION ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/contacts", emergencyContactsRoutes);
app.use("/api/vehicles", vehiclesRoutes);
app.use("/api/accidents", accidentsRoutes);
app.use("/api/alerts", alertsRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.status(200).send("Backend is up and running!");
});

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

/* ---------------- SERVER START ---------------- */
const startServer = async () => {
  try {
    await connectDB(); // ✅ Connect MySQL first

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    if (job?.start) {
      // job.start();
      console.log("⏱️ Cron job started");
    }
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
