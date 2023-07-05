const showReservation = require("express").Router();
const TicketReservation = require("../controller/Reservation.controller");

showReservation.route("/reservation").post(TicketReservation.newReservation);

module.exports = {
  showReservation,
};
