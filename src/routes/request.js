const express = require("express");
const userAuth = require("../middlewares/userMiddleware");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/sendRequest/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //validate first
      //validating toUserId
      const validReciever = User.findById(toUserId);
      if (!validReciever) {
        throw new Error("reciever does not exist");
      }
      //validating status
      const validStatus = ["ignored", "interested"];
      if (!validStatus.includes(status)) {
        throw new Error("invalid status");
      }

      //check if there is an existing request with these userIds

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        throw new Error("Request already exists between these users");
      }
      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await newConnectionRequest.save();
      res
        .status(200)
        .send(`Request sent successfully by ${fromUserId} to ${toUserId}`);
    } catch (err) {
      throw err;
    }
  }
);
module.exports = requestRouter;
