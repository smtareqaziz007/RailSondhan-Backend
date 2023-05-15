const { default: mongoose } = require("mongoose");
const createError = require("http-errors");

const {
  TrainLocation,
  EstimatedLocation,
} = require("../Models/Location.model");

module.exports = {
  saveLocation: async (req, res, next) => {
    // console.log(req.body);

    try {
      const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
      const userPostedRecently = await TrainLocation.findOne({
        userID: req.body.userID,
        createdAt: { $gte: oneMinuteAgo },
      });

      if (userPostedRecently) {
        throw createError(400, "User posted recently");
      }

      const trainLocation = new TrainLocation({
        userID: req.body.userID,
        trainNumber: req.body.trainNumber,
        location: req.body.location,
      });

      const result = await trainLocation.save();
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error.name == "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  getAllLocations: async (req, res, next) => {
    try {
      const results = await TrainLocation.find({}, { __v: 0 });
      if (!results) {
        throw createError(404, "No data found");
      }
      res.send(results);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  getLocationsForATrain: async (req, res, next) => {
    try {
      const results = await TrainLocation.find({
        trainNumber: req.params.trainNumber,
      });
      if (!results) {
        throw createError(404, "No data found");
      }
      res.send(results);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  getResultForTrain: async (req, res, next) => {
    try {
      // const result = await TrainLocation.findOne({ _id: id });
      const trainNumber = req.params.trainNumber;

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const existingLocation = await EstimatedLocation.findOne({
        trainNumber,
        updatedAt: { $gte: fiveMinutesAgo },
      });

      if (existingLocation) {
        // Location was updated less than 5 minutes ago, no need to update the location
        // console.log("Location found");
        res.send(existingLocation);
        return;
      }

      const deleted = await TrainLocation.deleteMany({
        createdAt: { $lt: fiveMinutesAgo },
      });

      const result = await TrainLocation.find({
        trainNumber: trainNumber,
        createdAt: { $gte: fiveMinutesAgo },
      });
      // console.log(result[0].location.coordinates[0]);

      if (!result.length) {
        throw createError(404, "No location found for this train");
      }
      const { median, index } = await result[0].findGeometricMedian(result);
      // console.log(median, index);
      const newLocation = await EstimatedLocation.findOneAndUpdate(
        { trainNumber },
        {
          $set: {
            location: { type: "Point", coordinates: median },
            calculatedAt: result[index].createdAt,
            updatedAt: Date.now(),
          },
        },
        { new: true, upsert: true }
      );

      res.send(newLocation);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Train Number"));
        return;
      }
      next(error);
    }
  },

  updateLocation: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
      const result = await TrainLocation.findByIdAndUpdate(
        id,
        updates,
        options
      );
      if (!result) {
        throw createError(404, "Location not found");
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid ID"));
        return;
      }
      next(error);
    }
  },

  deleteLocation: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await TrainLocation.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, "Location not found");
      }
      res.send(result);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid ID"));
        return;
      }
      next(error);
    }
  },
};
