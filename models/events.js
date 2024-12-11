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
  // organiser: {
  //   type: [mongoose.Schema.Types.ObjectId], 
  //   ref: ["users", "organizations"],
  //   default: null, // Specify the models it references
  // },
  organizer: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
  },
  // Dans MongoDB:  l'option enum est utilisée pour spécifier une liste de valeurs autorisées pour un champ de votre schéma
  organizerType: {
    type: String,
    enum: ['user', 'organization'], // Limit values to valid references
    required: true,
  },
  title: String,
  theme: String,
  category: String,
  reference: String,
  image : String,

  eventDate: Date,
  location: String,
  // minsizeGroup: Number,
  //maxsizeGroup: Number,
  sizeGroup: Number,
  preferences: [preferenceSchema],

  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  isFinished: Boolean,
});

// 3- Créer model
const Event = mongoose.model("events", eventSchema);

// 4- Exporter model
module.exports = Event;
