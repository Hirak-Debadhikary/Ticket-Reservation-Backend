const asyncHandler = require("express-async-handler");
const { ReservationModel } = require("../models/TicketReservation.model");
const { TVShowsModel } = require("../models/TVShows.model");
const { AuthModel } = require("../models/Auth.model");
const mongoose = require("mongoose");

//Book New Show -> http://localhost:8080/api/ticket/reservation
exports.newReservation = asyncHandler(async (req, res, next) => {
  const { show, date, seatNumber, user } = req.body;

  let existingShow;
  let existingUser;
  try {
    existingShow = await TVShowsModel.findById(show);
    existingUser = await AuthModel.findById(user);
  } catch (error) {
    return console.log(error);
  }

  if (!existingShow) {
    return res
      .status(404)
      .json({ message: "Movie not found with the given id" });
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "User not found  with the given id" });
  }

  let reservation;
  try {
    reservation = new ReservationModel({
      show,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(reservation);
    existingShow.bookings.push(reservation);
    await existingUser.save({ session });
    await existingShow.save({ session });

    await reservation.save({ session });

    session.commitTransaction();

    // reservation = await reservation.save();
  } catch (error) {
    return console.log(error);
  }
  if (!reservation) {
    return res.status(500).json({ message: "Unable to create a Reservation" });
  }
  return res.status(201).json({ reservation });
});

//Get one Single Show Which you booked-> http://localhost:8080/api/ticket/:id
exports.getReservation = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the Booking TVShow by its ID in the database
  const booking = await ReservationModel.findById(id);

  if (!booking) {
    return res.status(404).json({ message: "Booking show not found" });
  }

  return res.status(200).json(booking);
});

// Delete One Single Show which You booked -> http://localhost:8080/api/ticket/:id
exports.deleteReservation = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  try {
    const booking = await ReservationModel.findByIdAndRemove(id).populate(
      "user show"
    );
    console.log(booking);

    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(reservation);
    await booking.show.bookings.pull(reservation);

    await booking.user.save({ session });
    await booking.show.save({ session });

    session.commitTransaction();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
