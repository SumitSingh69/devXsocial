const express = require("express");
const { connectDB } = require("./src/config/database");
const app = express();
var cookieParser = require("cookie-parser");
const cors = require("cors");
//using a middleware to convert json to js object and to parse cookies for further reading
app.use(
  cors({
    origin: "https://dev-xsocial-frontend.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
require("dotenv").config();
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
    process.exit(1); // Exit the process with failure
  });
