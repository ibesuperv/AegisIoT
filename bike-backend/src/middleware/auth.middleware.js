// auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    /* ----------------- Validate Header ----------------- */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Authentication token not found",
      });
    }

    /* ----------------- Verify Token ----------------- */
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    /* ----------------- Fetch User ----------------- */
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found or token is invalid",
      });
    }

    /* ----------------- Attach User ----------------- */
    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization middleware error:", error);
    return res.status(500).json({
      message: "Authorization failed",
    });
  }
};

export default protectRoute;
