import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
import { verifyMail } from "../emailVerify/verifyMail.js";
import { Session } from "../models/session.model.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";
import { use } from "react";
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
        message: "Authorization  token is missing or invalid",
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
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // if user exists
    user.token = null;
    user.isVerified = true;
    // save the user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Login Controller */
const userLogin = async (req, res) => {
  try {
    // login data
    const { email, password } = req.body;

    // Validate the input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check email verification
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate access token
    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    // Generate refresh token
    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    // Check for existing session and delete it
    const existingSession = await Session.findOne({
      userId: user._id,
    });

    if (existingSession) {
      await Session.deleteOne({
        userId: user._id,
      });
    }

    // Create a new session
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
    });

    // Update login status
    user.isLoggedIn = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.username}`,
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Logout Controller */
const userLogout = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete the Session
    await Session.deleteMany({ userId });

    // Update the user
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Forgot Password and Send OTP*/
const forgotPassword = async (req, res) => {
  try {
    //Get Email
    const { email } = req.body;

    // Validate Email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    // Find user
    const user = await User.findOne({ email });

    // check user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate OTP expiry
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save the OTP and expiry
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP mail
    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Verify OTP */
const verifyOTP = async (req, res) => {
  // Get email and OTP
  const { otp } = req.body;
  const { email } = req.params.email;

  // Validate email and OTP
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }
  // find user
  try {
    const user = await User.findOne({ email });

    //check User
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // check otp and otpExpiry
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already verified",
      });
    }

    // check otp expiry with current date
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired . Please request a new one",
      });
    }

    // compare the otp
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // update the user
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { userRegister, verification, userLogin, userLogout, forgotPassword , verifyOTP };
