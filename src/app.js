const express = require("express");
const { adminAuth } = require("./middlewares/adminMiddleware");
const { userAuth } = require("./middlewares/userMiddleware");
const app = express();

app.get("/admin/dashboard", adminAuth, (req, res) => {
  res.send("Admin Dashboard accessed");
});

app.get("/admin/profile", adminAuth, (req, res) => {
  res.send("Admin Profile accessed");
});

app.get("/user/dashboard", userAuth, (req, res) => {
  res.send("User Dashboard accessed");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
