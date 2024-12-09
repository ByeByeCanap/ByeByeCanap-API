const mongoose = require("mongoose");

const aspirationsSchema = mongoose.Schema({
  themesInterest: [String],
  categoriesInterest: [String],
  themesSkill: [String],
  categoriesSkill: [String],
});

const userSchema = mongoose.Schema({
  // Personnal Infos
  lastName: String,
  firstName: String,
  nickName: String,
  birthDate: Date,
  gender: String,

  // Optional Infos
  avatar: String,
  aspirations: [aspirationsSchema],

  // Verification, is the Profile is Checked ?
  isProfileChecked: Boolean,

  // Profile Infos
  profileInfos: {
    type: [mongoose.Schema.Types.ObjectId], // Array of ObjectId
    ref: "profileInfos",
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
