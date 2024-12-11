var express = require("express");
var router = express.Router();
const { CheckBody } = require("../modules/checkbody");
const User = require("../models/users");
const ProfileInfos = require("../models/profileInfos");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
require("../models/connection");

// Route Signup
router.post("/signup", async (req, res) => {
  const {
    nickName,
    email,
    password,
    lastName,
    firstName,
    birthdate,
    gender,
    themesInterest,
    categoriesInterest,
    themesSkill,
    categoriesSkill,
    motivations,
    availability,
    locationPreference,
    preferredGroupType,
    personalValues,
    preferredPeople,
    causes,
    suggestions,
  } = req.body; // Liste des champs obligatoires

  const requiredFields = [
    "nickName",
    "email",
    "password",
    "lastName",
    "firstName",
  ]; // Vérification des champs obligatoires

  if (!CheckBody(req.body, requiredFields)) {
    return res.json({
      result: "Cannot create a user",
      error: "Missing required fields",
    });
  }

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ nickName });
    if (existingUser) {
      return res.json({
        result: "Cannot create a user",
        error: "Nickname already exists",
      });
    } // Hashage du mot de passe

    const hashedPassword = bcrypt.hashSync(password, 10); // Création du document ProfileInfos

    const newProfileInfos = new ProfileInfos({
      email,
      password: hashedPassword,
      token: uid2(32),
    });

    const savedProfileInfos = await newProfileInfos.save(); // Préparation des champs optionnels avec des valeurs par défaut si vides

    const userAspirations = {
      themesInterest: themesInterest || [],
      categoriesInterest: categoriesInterest || [],
      themesSkill: themesSkill || [],
      categoriesSkill: categoriesSkill || [],
    };

    const userAvailability = {
      availability: availability || [],
      locationPreference: locationPreference || null,
    };

    const userValues = {
      preferredPeople: preferredPeople || [],
      preferredGroupType: preferredGroupType || [],
      personalValues: personalValues || [],
      causes: causes || [],
    }; // Création du document User

    const newUser = new User({
      lastName,
      firstName,
      nickName,
      birthDate: birthdate,
      gender,
      aspirations: userAspirations,
      motivations: motivations || null,
      availability: userAvailability,
      values: userValues,
      suggestions: suggestions || null,
      profileInfos: savedProfileInfos._id,
    });

    const savedUser = await newUser.save();

    res.json({
      result: "User has been successfully created",
      userId: savedUser._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ result: "Cannot create a user", error: error.message });
  }
});

// Route Signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body; // Vérification des champs obligatoires pour connexion

  if (!CheckBody(req.body, ["email", "password"])) {
    return res.json({
      result: "Connection failed",
      error: "Missing required fields",
    });
  }

  try {
    // Recherche du profil d'authentification par email
    const profile = await ProfileInfos.findOne({ email });

    if (profile && bcrypt.compareSync(password, profile.password)) {
      // Si le mot de passe est correct, récupération de l'utilisateur associé
      const user = await User.findOne({ profileInfos: profile._id }).populate(
        "profileInfos"
      );

      res.json({
        result: "Connection successful",
        token: profile.token,
        userId: user._id,
        user: {
          nickName: user.nickName,
          lastName: user.lastName,
          firstName: user.firstName,
          email: profile.email,
        },
      });
    } else {
      res.json({
        result: "Connection failed",
        error: "User not found or wrong password",
      });
    }
  } catch (error) {
    res.status(500).json({ result: "Connection failed", error: error.message });
  }
});

module.exports = router;
