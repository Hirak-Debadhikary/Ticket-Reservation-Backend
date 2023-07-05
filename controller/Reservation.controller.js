const asyncHandler = require("express-async-handler");
const { ReservationModel } = require("../models/TicketReservation.model");
// const { TVShowsModel } = require("../models/TVShows.model");
// const { AuthModel } = require("../models/Auth.model");
// const mongoose = require("mongoose");

//For movie Reservation -> http://localhost:8080/api/ticket/reservation
exports.newReservation = asyncHandler(async (req, res, next) => {
  const { show, date, seatNumber, user } = req.body;

  // let existingShow;
  // let existingUser;
  // try {
  //   existingShow = await TVShowsModel.findById(show);
  //   existingUser = await AuthModel.findById(user);
  // } catch (error) {
  //   return console.log(error);
  // }

  // if (!existingShow) {
  //   return res
  //     .status(404)
  //     .json({ message: "Movie not found with the given id" });
  // }

  // if (!user) {
  //   return res
  //     .status(404)
  //     .json({ message: "User not found  with the given id" });
  // }

  let reservation;
  try {
    reservation = new ReservationModel({
      show,
      date: new Date(`${date}`),
      seatNumber,
      user,
    });

    // const session = await mongoose.startSession();
    // session.startTransaction();
    // existingUser.bookings.push(reservation);
    // existingShow.bookings.push(reservation);
    // await existingUser.save({ session });
    // await existingShow.save({ session });

    // await reservation.save({ session });

    // session.commitTransaction();

    reservation = await reservation.save();
  } catch (error) {
    return console.log(error);
  }
  if (!reservation) {
    return res.status(500).json({ message: "Unable to create a Reservation" });
  }
  return res.status(201).json({ reservation });
});
