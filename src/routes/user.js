const express = require("express");
const userAuth = require("../middlewares/userMiddleware");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
    }).populate(
      "fromUserId toUserId",
      "firstName midName lastName photoUrl age gender"
    );

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const { page = 1, limit = 3 } = req.query;
    const userId = req.user._id;
    const existingConnections = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });
    const otherUserIds = existingConnections.map((connection) => {
      if (connection.fromUserId.toString() === userId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    otherUserIds.push(userId);
    //find the count of all users except the ones in otherUserIds
    const totalFeedUsersCount = await User.countDocuments({
      _id: { $nin: otherUserIds },
    });
    const totalPages = Math.ceil(totalFeedUsersCount / limit);
    if (page > totalPages) {
      throw new Error("No more users to show");
    }
    if (limit > totalFeedUsersCount) {
      throw new Error("Limit exceeds total users count");
    }

    const feedUsers = await User.find({
      _id: { $nin: otherUserIds },
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("firstName midName lastName about age gender photoUrl");
    res.status(200).json({
      message: "Feed users fetched successfully",
      feedUsers,
      currentPage: page,
      totalPages,
      isNextPage: page < totalPages ? true : false,
      isPrevPage: page > 1 ? true : false,
    });
  } catch (err) {
    throw err;
  }
});

module.exports = userRouter;
