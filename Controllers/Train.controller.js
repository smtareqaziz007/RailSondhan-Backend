const createError = require("http-errors");
const { default: mongoose } = require("mongoose");

const Train = require("../Models/Trains.model");

module.exports = {
  saveTrain: async (req, res, next) => {
    const train = new Train({
      name: req.body.name + " Express",
      trainNumber: req.body.trainNumber,
      from: req.body.from,
      to: req.body.to,
      departure: req.body.departure,
      arrival: req.body.arrival,
    });

    try {
      const newTrain = await train.save();
      res.send(newTrain);
    } catch (error) {
      console.log(error.message);
      if (error.name == "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  getAllTrains: async (req, res, next) => {
    try {
      const trains = await Train.find({}, { __v: 0 });
      if (!trains) {
        throw createError.NotFound();
      }
      res.send(trains);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  },

  getATrain: async (req, res, next) => {
    try {
      train = await Train.findById(req.params.id);
      if (!train) {
        throw createError.NotFound();
      }
      res.send(train);
    } catch (error) {
      console.log(error.message);
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid ID"));
        return;
      }
      next(error);
    }
  },

  updateTrain: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
      const result = await Train.findByIdAndUpdate(id, updates, options);
      if (!result) {
        throw createError(404, "Train not found");
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

  deleteTrain: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await Train.findByIdAndDelete(id);
      if (!result) {
        throw createError(404, "Train not found");
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
