// const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { TVShowsModel } = require("../models/TVShows.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { AdminModel } = require("../models/Admin.model");

exports.addTVShows = asyncHandler(async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token not found" });
  }
  // console.log(extractedToken);
  let adminId;
  //verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  // create new TVShows
  const { title, description, releaseDate, posterUrl, featured } = req.body;
  if (
    !title &&
    title.trim() === "" &&
    !description &&
    description.trim() === "" &&
    !posterUrl &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let newShow;
  try {
    newShow = new TVShowsModel({
      title,
      description,
      releaseDate: new Date(`${releaseDate}`),
      posterUrl,
      featured,
      admin: adminId,
    });

    const session = await mongoose.startSession();
    const adminUser = await AdminModel.findById(adminId);
    session.startTransaction();
    await newShow.save({ session });
    adminUser.addedShows.push(newShow);
    await adminUser.save({ session });
    await session.commitTransaction();

    // newShow = await newShow.save();
  } catch (error) {
    console.log(error);
  }
  if (!newShow) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(201).json({ message: "Show Added Successfully", newShow });
});
// GET all TVShows
exports.getTVShows = asyncHandler(async (req, res, next) => {
  // Fetch all TVShows from the database
  const tvShows = await TVShowsModel.find();

  if (!tvShows) {
    return res.status(404).json({ message: "No TVShows found" });
  }

  return res.status(200).json(tvShows);
});

// Get a single Movie
exports.getTVShowsById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the TVShow by its ID in the database
  const tvShow = await TVShowsModel.findById(id);

  if (!tvShow) {
    return res.status(404).json({ message: "TVShow not found" });
  }

  return res.status(200).json(tvShow);
});
