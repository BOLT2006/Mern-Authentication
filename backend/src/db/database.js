import "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  try {
    await mongoose.connect(`${mongoUri}/yt-auth`);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exitCode = 1;
  }
};

export default connectDB;