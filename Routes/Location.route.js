const express = require("express");
const router = express.Router();

const LocationController = require("../Controllers/Location.controller");

// router.get("/find/:trainNumber", );

// Get all locations
router.get("/", LocationController.getAllLocations);

// save location for a train
router.post("/", LocationController.saveLocation);

// get all locations for a train
router.get("/:trainNumber", LocationController.getLocationsForATrain);

//get estimated location for a train
router.get("/estimated/:trainNumber", LocationController.getResultForTrain);

//update location with id
router.patch("/:id", LocationController.updateLocation);

//delete location with id
router.delete("/:id", LocationController.deleteLocation);

module.exports = router;
