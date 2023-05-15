// This file is not used anywhere

const createError = require("http-errors");

const TrainLocation = require("../Models/Location.model");

const calculateLocation = async (req, res, next) => {
  try {
    const trainNumber = req.params.trainNumber;
    const result = await TrainLocation.find({ trainNumber: trainNumber });
    // console.log(result[0].location.coordinates[0]);

    if (!result.length) {
      throw createError(404, "No location found for this train");
    }
    res.send(result);
  } catch (error) {
    console.log(error.message);
    if (error instanceof mongoose.CastError) {
      next(createError(400, "Invalid Train Number"));
      return;
    }
    next(error);
  }
};
