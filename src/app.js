const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
const app = express();
const userValidator = require("./utils/userValidator");
const bcrypt = require("bcrypt");

//using a middleware to convert json to js object
app.use(express.json());
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
    res.status(200).send("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(400).send("login failed " + err);
  }
});
app.get("/user", async (req, res) => {
  //find one user by id
  try {
    const users = await User.findById("68a165d4dd3d18e4a49296bf");
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

app.delete("/user", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ email: req.body.email }); //returns the deleted user's document
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

app.patch("/user/:id", async (req, res) => {
  // partial updation

  //user should not be able to change his email id
  const updatedData = req.body;
  const userId = req.params?.id;
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "midName",
      "lastName",
      "password",
      "age",
      "gender",
      "about",
      "photoUrl",
      "skills",
    ];
    const isAllowedToUpdate = Object.keys(updatedData).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    console.log(isAllowedToUpdate);
    if (!isAllowedToUpdate) {
      throw new Error("Invalid updates!");
    }
    if (updatedData?.skills.length > 10) {
      throw new Error("Cannot have more than 10 skills");
    }
    const replacedUser = await User.findOneAndUpdate(
      { _id: userId },
      updatedData,
      {
        runValidators: true,
        new: true,
      }
    );
    console.log("Updated User:", replacedUser);
    if (!replacedUser) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User updated successfully");
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
