const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const user = {
    firstName: "Sumit",
    lastName: "Bora",
    email: "sumt@bora.com",
    password: "password123",
    age: 25,
  };
  try {
    const newUser = new User(user);
    await newUser.save();
    res.send("Signup successfull");
  } catch (err) {
    res.status(500).send("Internal Server Error");
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
