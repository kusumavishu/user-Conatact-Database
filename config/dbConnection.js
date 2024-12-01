const mongoose = require("mongoose");
// const dotenv = require("dotenv").config();

// console.log("url", process.env.CONNECTION_STRING);

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database established:",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
