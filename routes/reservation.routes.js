const showReservation = require("express").Router();
const TicketReservation = require("../controller/Reservation.controller");

showReservation.route("/reservation").post(TicketReservation.newReservation);
showReservation.route("/:id").get(TicketReservation.getReservation);
showReservation.route("/:id").delete(TicketReservation.deleteReservation);
module.exports = {
  showReservation,
};
