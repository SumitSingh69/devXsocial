const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();

//using a middleware to convert json to js object
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    console.log(req.body); //cannot log body in raw json format
    const user = new User(req.body);
    await user.save(); //this should throw error
    res.status(200).send("User signed up successfully");
  } catch (err) {
    res.status(400).send("stop sendind duplicate emails bastard");
  }
});

app.get("/user", async (req, res) => {
  //find one user by id
  try {
    const users = await User.findById("68a16593558060cc89a38903");
    if (!users) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.status(200).send(users);
    }
  } catch (err) {
    res.status(500).send("something went wrong");
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
