const express = require("express");
const { userValidator } = require("../utils/userValidator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

// SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    userValidator(req);
    const { firstName, midName = "", lastName, email, password } = req.body;

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      midName,
      lastName,
      email,
      password: hashPassword,
    });
    const savedUser = await user.save();

    // generate JWT token
    const token = savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ HTTPS required for deployed frontend
      sameSite: "none", // ✅ cross-site cookie allowed
      maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
      path: "/", // ✅ cookie path
    });

    res
      .status(200)
      .json({ message: "User signed up successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("Signup failed: " + err);
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const registeredUser = await User.findOne({ email });
    if (!registeredUser) return res.status(404).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, registeredUser.password);
    if (!isMatch) return res.status(404).send("Invalid credentials");

    const token = registeredUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ✅ HTTPS required
      sameSite: "none", // ✅ cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
      path: "/", // ✅ must match logout
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: registeredUser,
    });
  } catch (err) {
    res.status(400).send("Login failed: " + err);
  }
});

// LOGOUT
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // ✅ must match login cookie
    sameSite: "none", // ✅ must match login cookie
    path: "/", // ✅ must match login cookie
  });
  res.send("User logged out successfully");
});

module.exports = authRouter;
