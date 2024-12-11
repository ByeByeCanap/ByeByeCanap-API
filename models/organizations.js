const mongoose = require("mongoose");

const organizationsSchema = mongoose.Schema({
  // Global Infos
  organizationName: String,
  organizationAddress: String,
  organizationDateCreation: Date,
  activity: String,
  immatriculationNumber: Number,
  logo: String,
  socialNetwork: String,

  // Contact Infos
  contactName: String,
  contactPhoneNumber: Number,
  contactEmail: String,

  // Optionnal Infos
  hasSubscribed: Boolean,

  // Profile infos
  profileInfos: {
    type: [mongoose.Schema.Types.ObjectId], // Array of ObjectId
    ref: ["profileInfos"],
  },
});

const Organization = mongoose.model("organizations", organizationsSchema);

module.exports = Organization;
