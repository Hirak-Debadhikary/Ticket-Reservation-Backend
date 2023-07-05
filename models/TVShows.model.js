const mongoose = require("mongoose");

const tvShowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
    },
    bookings: [{ type: mongoose.Types.ObjectId, ref: "Reservation" }],
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const TVShowsModel = mongoose.model("TVShows", tvShowSchema);
module.exports = { TVShowsModel };
