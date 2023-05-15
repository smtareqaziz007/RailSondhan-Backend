const boolean = require("@hapi/joi/lib/types/boolean");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  trainNumber: {
    type: Number,
    required: true,
    // unique: true,
  },

  from: {
    type: String,
    required: true,
  },

  to: {
    type: String,
    required: true,
  },

  departure: {
    type: String,
    required: true,
  },

  arrival: {
    type: String,
    required: true,
  },

  offDay: {
    type: String,
    // required: true,
  },

  isRunning: {
    type: boolean,
  },
});

const Train = mongoose.model("train", TrainSchema);
module.exports = Train;
