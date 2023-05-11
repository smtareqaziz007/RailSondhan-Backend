const express = require("express");
const router = express.Router();

const TrainController = require("../Controllers/Train.controller");

// Get all trains
router.get("/", TrainController.getAllTrains);

// Get a single train
router.get("/:id", TrainController.getATrain);

// Create a train
router.post("/", TrainController.saveTrain);

// Update a train
router.patch("/:id", TrainController.updateTrain);

// Delete a train
router.delete("/:id", TrainController.deleteTrain);

module.exports = router;
