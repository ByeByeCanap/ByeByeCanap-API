const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema({
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
  profileinfos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profileinfos",
  },
});

const Organization = mongoose.model("organizations", organizationSchema);

module.exports = Organization;
