import Router from "express";
import { register , getMe } from "../controllers/auth.controller.js";

const authRouter = Router();

// Routes

// Register a new user
authRouter.post("/register" , register);

//get user profile
authRouter.get("/me", getMe);

export default authRouter;
