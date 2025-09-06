const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    midName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    photoUrl: {
      type: String,
      required: false,
      default:
        "https://imgs.search.brave.com/pkPyTQFTOVFQw7Hki6hg6cgY5FPZ3UzkpUMsnfiuznQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvNTAwcC80/MS85MC9hdmF0YXIt/ZGVmYXVsdC11c2Vy/LXByb2ZpbGUtaWNv/bi1zaW1wbGUtZmxh/dC12ZWN0b3ItNTcy/MzQxOTAuanBn",
    },
    skills: {
      type: [String],
      required: false,
    },
    about: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid Gender");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
