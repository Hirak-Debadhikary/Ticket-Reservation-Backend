const asyncHandler = require("express-async-handler");
const { AuthModel } = require("../models/Auth.model");
const { AppError } = require("../class/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    },
  };
  return res.status(200).json(response);
});
