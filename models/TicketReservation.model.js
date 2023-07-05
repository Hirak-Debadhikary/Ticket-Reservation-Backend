const mongoose = require("mongoose");

const ticketReservationSchema = new mongoose.Schema(
  {
    show: {
      type: mongoose.Types.ObjectId,
      ref: "TVShows",
      require: true,
    },
    data: {
      type: String,
      require: true,
    },
    seatNumber: {
      type: Number,
      require: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      require: true,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const ReservationModel = mongoose.model("Reservation", ticketReservationSchema);
module.exports = { ReservationModel };
