import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: [true, "Username must be unique"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email must be unique"],
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
});

const User = mongoose.model("User", userSchema);

export default User;