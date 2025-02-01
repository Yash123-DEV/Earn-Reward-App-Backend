"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "shhh32425673hdbbjjhvbfjhfdbvhfvdbfjjdffbhh"; // Consider storing this in environment variables for better security
// Register User
module.exports.registerUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { password, email, fullname } = req.body;
            // Validate fullname
            if (!fullname) {
                return res.status(400).json({ error: "Fullname is required." });
            }
            // Validate email
            if (!email) {
                return res.status(400).json({ error: "Email is required." });
            }
            const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailFormat.test(email)) {
                return res.status(400).json({ error: "Invalid email format." });
            }
            // Validate password
            const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (!passwordFormat.test(password)) {
                return res.status(400).json({
                    error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.",
                });
            }
            // Check if user already exists
            const existingUser = yield usersModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists. Please login." });
            }
            // Hash the password
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            // Create a new user
            const newUser = new usersModel({
                email: email.trim().toLowerCase(), // Normalize email
                password: hashedPassword,
                fullname: fullname.trim(),
                coins: 450, // Default sign-up bonus
            });
            yield newUser.save();
            // Generate JWT token
            const token = jwt.sign({ email: newUser.email, id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
            return res.status(201).json({
                message: "User registered successfully.",
                token,
                coins: newUser.coins, // Include the coins in the response
            });
        }
        catch (error) {
            console.error("Error during registration:", error);
            return res.status(500).json({ error: "Internal server error." });
        }
    });
};
// Login User
module.exports.loginUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const user = yield usersModel.findOne({ email: email.trim().toLowerCase() });
            if (!user) {
                return res.status(401).json({ error: "Invalid email or password." });
            }
            // Compare passwords
            const isMatch = yield bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password." });
            }
            // Generate JWT token
            const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
            return res.status(200).json({ message: "Login successful.", token });
        }
        catch (error) {
            console.error("Error during login:", error);
            return res.status(500).json({ error: "Internal server error." });
        }
    });
};
module.exports.getUserCoins = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Extract the token from the Authorization header
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                return res.status(401).json({ error: "Unauthorized: No token provided" });
            }
            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);
            if (!decoded) {
                return res.status(401).json({ error: "Unauthorized: Invalid token" });
            }
            // Fetch the user from the database
            const user = yield usersModel.findOne({ email: decoded.email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            // Return the user's coin balance
            return res.status(200).json({ coins: user.coins });
        }
        catch (error) {
            console.error("Error fetching user coins:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    });
};
// const usersModel = require("../models/usersModel");
// import express, { Request, Response } from 'express';
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const JWT_SECRET = "shhh32425673hdbbjjhvbfjhfdbvhfvdbfjjdffbhh";
// module.exports.registerUser = async function (req: Request, res: Response) {
//   try {
//     const { password, email, fullname, coins } = req.body;
//     // Validate fullname
//     if(!fullname) {
//       return res.send("Fullname is required");
//     }
//     // Validate email
//     if (!email) {
//       return res.status(400).json({ error: "Email is required." });
//     }
//     const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailFormat.test(email)) {
//       return res.status(400).json({ error: "Invalid email format." });
//     }
//     // Validate password
//     const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
//     if (!passwordFormat.test(password)) {
//       return res.status(400).json({
//         error: "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.",
//       });
//     }
//     // Check if user already exists
//     const existingUser = await usersModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists. Please login." });
//     }
//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     // Create a new user
//     const newUser = await usersModel.create({
//       email,
//       password: hashedPassword,
//       fullname,
//       coins: 450, 
//     });
//     // Generate JWT token
//     const token = jwt.sign({ email }, JWT_SECRET);
//     res.cookie("token", token, { httpOnly: true });
//     return res.status(201).json({ message: "User registered successfully.", token });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };
// module.exports.loginUser = async function (req : Request, res : Response) {
//   try {
//     const { email, password } = req.body;
//     // Find the user by email
//     const user = await usersModel.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password." });
//     }
//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid email or password." });
//     }
//     // Generate JWT token
//     const token = jwt.sign({ email: user.email }, JWT_SECRET);
//     res.cookie("token", token, { httpOnly: true });
//     return res.status(200).json({ message: "Login successful.", token });
//   } catch (error) {
//     console.error("Error during login:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };
