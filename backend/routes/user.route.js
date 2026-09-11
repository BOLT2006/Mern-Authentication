import express from "express";
import {
  userLogin,
  userLogout,
  userRegister,
  verification,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.middleware.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/verify", verification);
router.post("/login", userLogin);
router.post("/logout", isAuthenticated ,userLogout);


export default router;
