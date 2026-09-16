import express from "express";
import {
  changePassword,
  forgotPassword,
  userLogin,
  userLogout,
  userRegister,
  verification,
  verifyOTP,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.middleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/verify", verification);
router.post("/login", userLogin);
router.post("/logout", isAuthenticated, userLogout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email",changePassword);

export default router;
