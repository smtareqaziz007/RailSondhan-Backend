const express = require("express");
const app = express();
const cors = require("cors");
const createError = require("http-errors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Dhaka");

const TrainLocationRoute = require("./Routes/Location.route");
const AuthRoute = require("./Routes/Auth.route");
const TrainRoute = require("./Routes/Train.route");
const { verifyAccessToken } = require("./helpers/jwt.helpers");
require("./helpers/init_redis");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// Initialize DB
require("./helpers/initDataBase")();

app.use("/train", verifyAccessToken, TrainRoute);
app.use("/location", verifyAccessToken, TrainLocationRoute);
app.use("/auth", AuthRoute);

app.get("/", async (req, res) => {
  res.send("Hello from express.");
});

app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

app.use((req, res, next) => {
  next(createError(404, "Page not found"));
});

//Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: res.status,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
