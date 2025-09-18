const express = require("express");
const userAuth = require("../middlewares/userMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    /*
        Steps:
        get the user id -> find all the requests where toUserId is the userId and status is 'interested'
        */
    const userId = req.user._id;
    const recievedRequests = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", "firstName midName lastName");

    res.status(200).send({
      message: "Recieved requests fetched successfully",
      recievedRequests,
    });
  } catch (err) {
    throw err;
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const connnections = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
      status: "accepted",
    }).populate("fromUserId toUserId", "firstName midName lastName");

    const allConnections = connnections.map((connection) => {
      if (connection.fromUserId._id.toString() === userId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.status(200).send({
      message: "Connections fetched successfully",
      allConnections,
    });
  } catch (err) {
    throw err;
  }
});

module.exports = userRouter;
