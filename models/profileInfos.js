const mongoose = require("mongoose");

const profileInfosSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: String,
  descriptionProfile: String,
  inscriptionDate: Date,
});

const ProfileInfos = mongoose.model("profileInfos", profileInfosSchema);

module.exports = ProfileInfos;
