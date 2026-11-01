import express from "express";
import morgan from "morgan";

const app = new express();

app.use(express.json());
app.use(morgan("dev"));

export default app;
