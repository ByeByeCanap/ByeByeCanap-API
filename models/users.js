const mongoose = require("mongoose");

// Schéma pour les aspirations de l'utilisateur (sosus document)
const aspirationsSchema = mongoose.Schema({
  themesInterest: { type: [String], default: [] },
  categoriesInterest: { type: [String], default: [] },
  themesSkill: { type: [String], default: [] },
  categoriesSkill: { type: [String], default: [] },
});

// Schéma pour la disponibilité et la logistique
const availabilitySchema = mongoose.Schema({
  availability: { type: [String], default: [] },
  locationPreference: { type: String, default: null },
});

// Schémas pour les valeurs perso
const valuesSchema = mongoose.Schema({
  preferredPeople: { type: [String], default: [] },
  preferredGroupType: { type: [String], default: [] },
  personalValues: { type: [String], default: [] },
  causes: { type: [String], default: [] },
});

// Schéma principal du user
const userSchema = mongoose.Schema({
  // Informations personnelles
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  nickName: { type: String, required: true, unique: true },

  birthDate: { type: String },
  gender: { type: String }, // Informations supp

  avatar: { type: String, default: null },
  aspirations: { type: aspirationsSchema, default: {} },
  motivations: { type: String, default: null },
  availability: { type: availabilitySchema, default: {} },
  values: { type: valuesSchema, default: {} },
  suggestions: { type: String, default: null }, // Vérification profil
  descriptionProfile: { type: String, default: null },

  isProfileChecked: { type: Boolean, default: false }, // Lien vers les informations d'authentification

  profileInfos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profileInfos",
    },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
