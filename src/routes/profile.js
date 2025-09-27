const express = require("express");
const userAuth = require("../middlewares/userMiddleware");
const { updateProfileValidator } = require("../utils/userValidator");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const userProfile = req.user;
    res.status(200).json({
      message: "User profile fetched successfully",
      data: userProfile,
    });
  } catch (err) {
    throw err;
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const isAllowed = updateProfileValidator(req);
    if (!isAllowed) {
      throw new Error("Invalid data for update");
    }
    const user = req.user;
    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });
    await user.save();
    res.send({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    throw err;
  }
});

profileRouter.patch("/profile/password/update", userAuth, async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      throw new Error("Both password and confirm password are required");
    }
    if (password !== confirmPassword) {
      throw new Error("Password and confirm password must be same");
    }
    const user = req.user;
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    res.send("Password updated successfully");
  } catch (err) {
    throw err;
  }
});

module.exports = profileRouter;
