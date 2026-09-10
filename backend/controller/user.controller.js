import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
import { verifyMail } from "../emailVerify/verifyMail.js";
/* User Register */
const userRegister = async (req, res) => {
  try {
    // get user from frontend
    const { username, email, password } = req.body;
    // validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    // check if user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // create new User
    // bcrypt : is used to securely hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    //create JWT Token
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    // Mail
    verifyMail(token, email);
    // save the token
    newUser.token = token;
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "User  Registered Successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Verification */
const verification = async (req, res) => {
  try {
    //Authorization : Bearer <JWT>
    const authHeader = req.headers.authorization; // gives bearer : yJhbGciOiJIUzI1NiIs...

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Authorization is token is missing and invalid",
      });
    }

    // if valid token
    // token extraction
    const token = authHeader.split(" ")[1];

    // verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      if (err.message === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification failed",
      });
    }
    const user  = await User.findById(decoded.id)
    if(!user){
        return res.status(404).json({
            success : false,
            message : "User not found"
        })
    }
    // if user exists
    user.token = null
    user.isVerified = true
    // save the user
    await user.save()

    return res.status(200).json({
        success : true,
        message : "Email verified Successfully"
    })
  } catch (error) {
    return res.status(500).json({
        success : false,
        message : error.message
    })
  }
};


export { 
    userRegister ,
    verification
};
