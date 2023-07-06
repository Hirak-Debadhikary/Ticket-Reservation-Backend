const asyncHandler = require("express-async-handler");
const { AuthModel } = require("../models/Auth.model");
const { AppError } = require("../class/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ReservationModel } = require("../models/TicketReservation.model");

// Signup :-> http://localhost:8080/api/auth/signup
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // if user with this email exists
  const isUserExists = await AuthModel.findOne({ email });
  if (isUserExists) {
    next(new AppError(`This ${email} already exists please login`, 400));
  }

  // if user not exists then create user
  // hash password
  const hashPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUND)
  );
  // create user
  const user = await AuthModel.create({
    name,
    email,
    password: hashPassword,
  });

  // send response
  const response = {
    status: "success",
    message: "Signup Successfully!",
  };

  return res.status(200).json(response);
});

// Login :-> http://localhost:8080/api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // if user is not exists throw error
  const isUserExists = await AuthModel.findOne({ email });
  if (!isUserExists) {
    next(new AppError(`You have to Signup first`, 404));
  }
  // if user exists then check password
  const isPassword = await bcrypt.compare(password, isUserExists.password);
  if (!isPassword) {
    next(new AppError(`Invalid credentials`, 400));
    return;
  }
  // if password is match then create jwt token
  const token = jwt.sign({ _id: isUserExists._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // send success response
  const response = {
    status: "success",
    message: "Successfully Login",
    data: {
      token,
      name: isUserExists.name,
      isAdmin: isUserExists.isAdmin,
    },
  };
  return res.status(200).json(response);
});

// Get All Users :-> http://localhost:8080/api/auth/getallusers
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // Fetch all users from the database
  const allUsers = await AuthModel.find();

  // Send response
  const response = {
    status: "success",
    message: "Successfully retrieved all users",
    data: allUsers,
  };

  return res.status(200).json(response);
});

// Update User :-> http://localhost:8080/api/auth/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    // Find the user by ID
    const user = await AuthModel.findByIdAndUpdate(id);

    if (!user) {
      return next(new AppError(`User not found with ID: ${id}`, 404));
    }

    // Update user details
    user.name = name;
    user.email = email;
    user.password = password;

    // Save the updated user
    await user.save();

    // Send response
    const response = {
      status: "success",
      message: "User details updated successfully",
      data: user,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return next(new AppError("Internal server error", 500));
  }
});

// Delete User :-> http://localhost:8080/api/auth/:id
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await AuthModel.findByIdAndRemove(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get Bookings OF User :-> http://localhost:8080/api/auth/bookings/:id
exports.getBookingsOfUser = asyncHandler(async (req, res, next) => {
  // Assuming you have a 'Booking' model or database schema

  // Get the user ID from the request parameters or wherever it's stored
  const userId = req.params.id;

  // Fetch bookings of the specified user
  const bookings = await ReservationModel.find({ user: userId });

  if (!bookings) {
    return res.status(500).json({ message: "Unable to get Bookings" });
  }
  // Respond with the bookings
  res.status(200).json({
    success: true,
    data: bookings,
  });
});
