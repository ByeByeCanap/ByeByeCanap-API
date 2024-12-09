// 1- Import of mongoose
const mongoose = require("mongoose");

// 2- Créer schema
// Creation sous-document preferenceSchema to be attached to eventscheman
const preferenceSchema = mongoose.Schema({
  age: Number,
  gender: String,
  other: String,
});

// Creation eventschema
const eventSchema = mongoose.Schema({
  organiser: {
    type: [mongoose.Schema.Types.ObjectId], // Array of ObjectId
    ref: ["users", "organizations"],
    default: null, // Specify the models it references
  },
  theme: String,
  category: String,
  reference: String,

  eventDate: Date,
  location: String,
  minsizeGroup: Number,
  maxsizeGroup: Number,
  preferences: [preferenceSchema],

  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  isFinished: Boolean,
});

// 3- Créer model
const Event = mongoose.model("events", eventSchema);

// 4- Exporter model
module.exports = Event;
