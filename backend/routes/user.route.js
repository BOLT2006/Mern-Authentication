import express from "express";
import {
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
router.post("/logout", isAuthenticated ,userLogout);
router.post("/forgot-password" , forgotPassword)
router.post("/verify-otp/:email" , verifyOTP)


export default router;
