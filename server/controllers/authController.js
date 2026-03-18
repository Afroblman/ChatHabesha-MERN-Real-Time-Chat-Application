import { generateToken } from "../config/token.js";
import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

// Register a new user
export const register = async (req, res) => {
  const { fullName, email, password, profilePic, bio } = req.body;

  if (!fullName || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existUser = await Users.findOne({ email });
    if (existUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await Users.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
      bio,
    });

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Return user data excluding password
    const userData = await Users.findById(newUser._id).select("-password");
    return res.json({
      success: true,
      message: "Account created successfully",
      token,
      user: userData,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Logging an existing user
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    // Find user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(user._id);

    // Mark user as online and return data without password
    const userData = await Users.findById(user._id, { isOnline: true }).select(
      "-password",
    );
    return res.json({
      success: true,
      message: "Login Successfull",
      token,
      user: userData,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    // Update user status to offline
    await Users.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date(),
    });

    // Clear auth cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Check if user is authenticated
export const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    const userId = req.user._id;

    let updatedData = { bio, fullName };

    // If profilePic is provided, upload to Cloudinary
    if (profilePic) {
      const uploadProfilePic = await cloudinary.uploader.upload(profilePic);
      updatedData.profilePicture = uploadProfilePic.secure_url;
    }

    // Update user in DB and return updated data
    const updatedUser = await Users.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
