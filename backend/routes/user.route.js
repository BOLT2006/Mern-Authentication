import express from "express";
import { userRegister, verification } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/verify", verification);

export default router;
