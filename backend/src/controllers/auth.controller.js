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
    user : {
        username: newUser.username,
        email: newUser.email,
    },
    token
   });

   
 }
