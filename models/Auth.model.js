const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    bookings: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
  },
);

const AuthModel = mongoose.model("Users", authSchema);
module.exports = { AuthModel };
