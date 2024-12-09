const mongoose = require("mongoose");

const eventProSchema = mongoose.Schema({
  theme: String,
  category: String,
  reference: String,
});

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

  //   token: String, ?
  //   password: String, ?
  //   name: String,
  //   address: String,
  //   immatriculationNumber: String,
  //   descriptionProfil: String, ?
  //   dateInscription: Date, ?
  //   dateCreation: Date,
  //   activity: String, ?
  //   contactName: String,
  //   phoneNumber: Number,
  //   adressMail: String,
  //   socialNetwork: String,
  //   logo: String,
  //   advert: Boolean,
  //   hasSubscribed: Boolean,
  //   eventPros: [eventProSchema],
});

const Organizations = mongoose.model("organizations", organizationsSchema);

module.exports = Organizations;
