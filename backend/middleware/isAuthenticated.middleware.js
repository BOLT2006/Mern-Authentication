import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or invalid",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        // Check expired token
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message:
              "Access Token is expired, use refresh token to generate again",
          });
        }

        // Invalid token
        return res.status(401).json({
          success: false,
          message: "Access token is missing or invalid",
        });
      }

      // Get user ID from decoded token
      const { id } = decoded;

      // Find user
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Attach user ID to request
      req.userId = user._id;

      // Continue to controller
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};