import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";

const app = new express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);

export default app;
