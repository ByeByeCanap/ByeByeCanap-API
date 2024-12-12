const mongoose = require("mongoose");

const profileInfosSchema = new mongoose.Schema({
  email: String,
  password:  String,
  token:  String,
  userType:  String,
  descriptionProfile:  String,
  inscriptionDate: Date,
  users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
},
{collection : "profileInfos" }
);


const ProfileInfos = mongoose.model("profileInfos", profileInfosSchema);
module.exports = ProfileInfos;
