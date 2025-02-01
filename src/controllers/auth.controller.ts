const usersModel = require("../models/usersModel");
import express, { Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register User
module.exports.registerUser = async function (req: Request, res: Response) {
  try {
    const { password, email, fullname } = req.body;

    if (!fullname) {
      return res.status(400).json({ error: "Fullname is required." });
    }

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordFormat.test(password)) {
      return res.status(400).json({
        error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.",
      });
    }

    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists. Please login." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new usersModel({
      email: email.trim().toLowerCase(), 
      password: hashedPassword,
      fullname: fullname.trim(),
      coins: 450, 
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      coins: newUser.coins, // Include the coins in the response
    });

  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports.getUserCoins = async function (req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Fetch the user from the database
    const user = await usersModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's coin balance
    return res.status(200).json({ coins: user.coins });
  } catch (error) {
    console.error("Error fetching user coins:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.loginUser = async function (req: Request, res: Response) {
  try {   
    const { email, password } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Validate password
    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    // Find the user by email
    const user = await usersModel.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT token
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined.");
      return res.status(500).json({ error: "Internal server error." });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });

    return res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    console.error("Error during login:", error); // Log the error
    return res.status(500).json({ error: "Internal server error." });
  }
};


console.log("JWT_SECRET:", JWT_SECRET);

