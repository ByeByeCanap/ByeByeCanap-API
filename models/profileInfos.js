const mongoose = require("mongoose");

const profileInfosSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true },
  userType: { type: String, required: true },
  descriptionProfile: { type: String, default: null },
  inscriptionDate: { type: Date, default: Date.now },
});

const ProfileInfos = mongoose.model("profileInfos", profileInfosSchema);
module.exports = ProfileInfos;
