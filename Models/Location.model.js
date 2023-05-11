// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const TrainLocationSchema = new Schema({
//   userID: {
//     type: String,
//     required: false,
//   },

//   trainID: {
//     type: Number,
//     required: true,
//   },

//   latitude: {
//     type: Number,
//     required: true,
//   },

//   longtitude: {
//     type: Number,
//     required: true,
//   },
// });

// const TrainLocation = mongoose.model("train-location", TrainLocationSchema);

// module.exports = TrainLocation;

const mongoose = require("mongoose");
const geojson = require("mongoose-geojson-schema");
const turf = require("@turf/turf");

const trainSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      // required: true,
    },
    // trainID: {
    //   type: String,
    //   // required: true,
    // },

    trainNumber: {
      type: Number,
      required: true,
    },

    location: {
      type: mongoose.Schema.Types.Point, // Use the Point type for GeoJSON coordinates
      // type: "Point",
      required: true,
    },
  },
  {
    timestamps: true,
    timezone: "Asia/Dhaka",
  }
);

const resultSchema = new mongoose.Schema(
  {
    // trainID: {
    //   type: String,
    //   // required: true,
    // },

    trainNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    location: {
      type: mongoose.Schema.Types.Point, // Use the Point type for GeoJSON coordinates
      // type: "Point",
      required: true,
    },

    calculatedAt: Date,
  },
  {
    timestamps: true,
  }
);

// trainSchema.plugin(geojson); // Apply the mongoose-geojson-schema plugin
trainSchema.methods.findGeometricMedian = async function (results) {
  try {
    const points = results.map((result) => {
      return turf.point([
        result.location.coordinates[0],
        result.location.coordinates[1],
      ]);
    });
    // console.log(points[4]);
    // const median = turf.center(turf.featureCollection(points));
    // return median.geometry.coordinates;
    const center = turf.center(turf.featureCollection(points), {
      method: "mad",
    });
    const nearest = turf.nearestPoint(center, turf.featureCollection(points));
    const median = [
      nearest.geometry.coordinates[0],
      nearest.geometry.coordinates[1],
    ];
    const index = points.findIndex(
      (point) =>
        point.geometry.coordinates[0] === median[0] &&
        point.geometry.coordinates[1] === median[1]
    );

    return { median, index };
  } catch (error) {
    throw error;
  }
};

TrainLocation = mongoose.model("location", trainSchema);
EstimatedLocation = mongoose.model("estimate", resultSchema);

module.exports = { TrainLocation, EstimatedLocation };
