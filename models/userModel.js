const mongoose = require("mongoose");

const user = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      message: "Name validation failed",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
      message: "Email validation failed",
    },
    password: {
      type: String,
      required: true,
      message: "Password validation failed",
    },
    images: {
      type: String,
      default: "imagesUlodes/adminimags.jpg",
    },
  },
  {
    timestamps: true,
  }
);
const admin = mongoose.model("admin", user);
module.exports = admin;
