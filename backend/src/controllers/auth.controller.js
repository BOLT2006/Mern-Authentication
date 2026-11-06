import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

 export async function register (req , res) {

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

    // Save the user to the database
    await newUser.save();
}

