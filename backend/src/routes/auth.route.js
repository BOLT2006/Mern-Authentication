import Router from "express";
import { register } from "../controllers/auth.controller.js";

const authRouter = Router();

// Routes

authRouter.post("/register" , register);

export default authRouter;
