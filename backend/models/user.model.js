import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: true,
      required: true,
    },
    email: {
      type: true,
      required: true,
      unique: true,
    },
    password: {
      type: true,
      required: true,
    },
    isVerified: {
      type: true,
      default: false,
    },

    isLoggedIn: {
      type: true,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    otp: {
      type: true,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User" , userSchema);
