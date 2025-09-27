const express = require("express");
const { userValidator } = require("../utils/userValidator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    userValidator(req);
    const { firstName, midName = "", lastName, email, password } = req.body;
    //hash the password and store the hash password in the DB instead of the real password
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      midName,
      lastName,
      email,
      password: hashPassword,
    });
    // anyone who signed up successfully should be also logged in
    const savedUser = await user.save();
    // generate a JWT token for this new user and send it in the res.cookies
    const token = savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 3600000),
    });
    res
      .status(200)
      .json({ message: "User signed up successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("singup failed " + err);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //check wheter this is a regitered email id
    const registeredUser = await User.findOne({ email: email });
    if (!registeredUser) {
      throw new Error("invalid crendentials");
    }
    //compare the registerd user's password to the password provided
    const isMatch = await bcrypt.compare(password, registeredUser.password);
    if (!isMatch) {
      res.status(404).send("user not found");
    }
    //generate a JWT token
    const token = registeredUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 7 * 3600000),
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: registeredUser,
    });
  } catch (err) {
    res.status(400).send("login failed " + err);
  }
});
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // must match the login cookie in dev
    sameSite: "strict",
    path: "/",
  });
  res.send("User logged out successfully");
});

module.exports = authRouter;
