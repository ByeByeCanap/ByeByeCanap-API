const mongoose = require("mongoose");

const profileinfosSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    token: String,
    userType: String,
    descriptionProfile: String,
    inscriptionDate: Date,
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  }
  //{collection : "profileinfos" }
);

const profileinfos = mongoose.model("profileinfos", profileinfosSchema);

module.exports = profileinfos;
