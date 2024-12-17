// 1- Import of mongoose
const mongoose = require("mongoose");

// 2- Créer schema
// Creation sous-document preferenceSchema to be attached to eventscheman
const preferenceSchema = mongoose.Schema({
  ageRange: String,
  gender: String,
  other: String,
});

// Creation eventschema
const eventSchema = mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profileinfos",
  },

  title: String,
  theme: String,
  category: String,
  reference: String,
  image: String,
  eventDate: Date,
  location: String,
  // minsizeGroup: Number,
  //maxsizeGroup: Number,
  sizeGroup: String,
  description: String,
  preferences: preferenceSchema,

  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  isFinished: Boolean,
});

// 3- Créer model
const Event = mongoose.model("events", eventSchema);

// 4- Exporter model
module.exports = Event;
