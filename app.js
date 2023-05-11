const express = require("express");
const app = express();
const cors = require("cors");
const createError = require("http-errors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Dhaka");
// process.env.TZ = "Asia/Dhaka";
// d = new Date();
// d.toLocaleTimeString();
// console.log(d.toLocaleTimeString());

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

app.use("/train", TrainRoute);
app.use("/location", TrainLocationRoute);
app.use("/auth", AuthRoute);

app.get("/", verifyAccessToken, async (req, res, next) => {
  res.send("Hello from express.");
});

app.use((req, res, next) => {
  // const err = new Error("404 Not Found");
  // err.status = 404;
  // next(err);
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
