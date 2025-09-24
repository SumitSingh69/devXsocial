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
    await user.save();
    res.status(200).send("User signed up successfully");
  } catch (err) {
    console.log(err);
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
      throw new Error("invalid crendentials");
    }
    //generate a JWT token
    const token = registeredUser.getJWT();
    console.log(token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 3600000),
    });
    console.log(registeredUser);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: registeredUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("login failed " + err);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User logged out successfully");
});

module.exports = authRouter;
