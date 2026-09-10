import express from "express";
import { userLogin, userRegister, verification } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/verify", verification);
router.post("/login" , userLogin)

export default router;
