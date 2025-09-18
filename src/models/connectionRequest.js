const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "ignored", "interested"],
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  // validate that the fromUserId and toUserId are not the same
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("fromUserId and toUserId cannot be the same");
  }
  next();
});

const ConnectionRequest = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
