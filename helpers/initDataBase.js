const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv").config();

//4yZ4ORG1WF1z49hL
//mongodb+srv://smtareqaziz007:<password>@testcluster.xwvijgp.mongodb.net/?retryWrites=true&w=majority

module.exports = () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => console.log(err.message));

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DataBase");
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected");
  });

  process.on("SIGINT", () => {
    mongoose.connection
      .close()
      .then(() => {
        process.exit(0);
      })
      .catch((err) => console.log(err.message));
  });
};
