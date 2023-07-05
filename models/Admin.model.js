const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
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
    addedShows: [
      {
        type: mongoose.Types.ObjectId,
        ref: "TVShows",
      },
    ],
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const AdminModel = mongoose.model("Admin", adminSchema);
module.exports = { AdminModel };
