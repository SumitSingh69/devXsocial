const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sumitsinghboradev:ouOjlUbFu2Udf6tP@namastenode.2xp0mcx.mongodb.net/devTinder"
  ); //returns a promise
};

module.exports = { connectDB };
