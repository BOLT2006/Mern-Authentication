import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/note-app`);
    console.log("MongoDB connected Successfully!!");
  } catch (error) {
    console.log("MongoDB connection error ", error);
  }
};
export default connectDB;
