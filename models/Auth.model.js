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
    isAdmin:{
      type : Boolean,
      default : false
    }
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const AuthModel = mongoose.model("auth", authSchema);
module.exports = { AuthModel };
