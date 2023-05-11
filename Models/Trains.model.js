const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  number: {
    type: Number,
    required: true,
    unique: true,
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
});

const Train = mongoose.model("train", TrainSchema);
module.exports = Train;
