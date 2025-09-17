const express = require("express");
const userAuth = require("../middlewares/userMiddleware");

const requestRouter = express.Router();

requestRouter.post("/sendRequest", userAuth, (req, res) => {
  try {
    const userName = req.user.firstName;
    res.status(200).send(`Request sent successfully by ${userName}`);
  } catch (err) {
    throw err;
  }
});
module.exports = requestRouter;
