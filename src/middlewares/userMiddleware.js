const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    console.log("hello ji");
    console.log(req.cookies);
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).send("you are not logged in , login first");
    }
    const recievedToken = token;
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
    console.log("bad ");
    res.status(400).send("authentication failed " + err.message);
  }
};

module.exports = userAuth;
