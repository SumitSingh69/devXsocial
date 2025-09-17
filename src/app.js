const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();
const userValidator = require("./utils/userValidator");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/userMiddleware");
//using a middleware to convert json to js object
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
    res.status(200).send("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("login failed " + err);
  }
});

app.get("/profile", userAuth, (req, res) => {
  try {
    const userProfile = req.user;
    console.log(req.user);
    console.log(userProfile);
    res.status(200).send({
      message: "User profile fetched successfully",
      userProfile,
    });
  } catch (err) {
    throw err;
  }
});
app.post("/sendRequest", userAuth, (req, res) => {
  try {
    const userName = req.user.firstName;
    res.status(200).send(`Request sent successfully by ${userName}`);
  } catch (err) {
    throw err;
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
    process.exit(1); // Exit the process with failure
  });
