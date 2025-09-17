const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies;
    if (!token) {
      throw new Error("unauthenticated");
    }
    const recievedToken = token?.token;
    const decoded = jwt.verify(recievedToken, "topSecret234");
    if (!decoded) {
      throw new Error("unauthenticated");
    }
    const userId = decoded._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("unauthenticated");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("authentication failed " + err);
  }
};

module.exports = userAuth;
