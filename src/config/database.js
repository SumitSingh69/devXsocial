const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL); //returns a promise
};

module.exports = { connectDB };
