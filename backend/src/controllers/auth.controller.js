import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

// Register a new user
export async function register(req, res) {
  // Data From Request Body
  const { username, email, password } = req.body;

  // Check if user is already registered
  const isAlreadyRegistered = await User.findOne({
    $or: [{ username }, { email }],
  });

  // If user is already registered, return error
  if (isAlreadyRegistered) {
    return res.status(400).json({ message: "User is already registered" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  // Save the new user to the database
  await newUser.save();

  // Generate a JWT token
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Return the token
  res.status(201).json({
    message: "User registered successfully",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
    token,
  });
}

// Get user profile
export async function getMe(req, res) {
  //get token from header
  const token = req.headers.authorization.split(" ")[1];

  //check if token is valid
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  //verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //get user from database
  const user = await User.findById(decoded.id).select("-password");

  //check if user exists
    if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //return user
  res.status(200).json({ 
    message: "User profile fetched successfully",
    user: {
      username: user.username,
      email: user.email,
    }
   });
}
