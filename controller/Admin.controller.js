const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { AdminModel } = require("../models/Admin.model");
const jwt = require("jsonwebtoken");

exports.adminSignup = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if admin already exists
    const isAdminExists = await AdminModel.findOne({ email });
    if (isAdminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND)
    );

    // Create a new admin
    const newAdmin = new AdminModel({ email, password: hashedPassword });
    const savedAdmin = await newAdmin.save();

    if (!savedAdmin) {
      return res.status(500).json({ message: "Unable to store admin" });
    }

    return res.status(201).json({ newAdmin: savedAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

exports.adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    // Send success response with token
    return res.status(200).json({
      token,
      id: admin._id,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

exports.getAllAdmins = asyncHandler(async (req, res, next) => {
  try {
    // Retrieve all admins from the database
    const admins = await AdminModel.find();

    return res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
