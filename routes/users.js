var express = require("express");
var router = express.Router();
const { CheckBody } = require("../modules/checkbody");
const User = require("../models/users");
const profileinfos = require("../models/profileInfos");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
require("../models/connection");

// Route Signup
router.post("/signup", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    nickName,
    password,
    userType, // reducer --> recupérer depuis la page UserTypeScreen
    birthdate,
    gender,
    themesInterest,
    categoriesInterest,
    themesSkill,
    categoriesSkill,
    motivations,
    preferredGroupType,
    preferredPeople,
    availability,
    locationPreference,
    personalValues,
    causes,
    suggestions,
    descriptionProfile,
  } = req.body;

  // Check required fields
  const requiredFields = [
    "nickName",
    "email",
    "password",
    "userType",
    "lastName",
    "firstName",
  ];
  if (!CheckBody(req.body, requiredFields)) {
    return res.status(400).json({
      result: "Cannot create an user, Missing or empty fields",
    });
  }

  try {
    // Check if user already exists
    const existingNickName = await User.findOne({ nickName });
    const existingEmail = await profileinfos.findOne({ email });

    if (existingNickName || existingEmail) {
      return res.status(409).json({
        result:
          "User with the same email address or/and with the same Username already exist",
      });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create profileinfos
    const newprofileinfos = new profileinfos({
      email,
      password: hashedPassword,
      userType,
      token: uid2(32),
    });

    const savedprofileinfos = await newprofileinfos.save();

    // Create User and link profileinfos

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
    };

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
      profileinfos: savedprofileinfos._id, // Link to profileinfos
      descriptionProfile: descriptionProfile,
    });

    const savedUser = await newUser.save();

    // Update profileinfos to link back to User
    savedprofileinfos.users = savedUser._id;
    await savedprofileinfos.save();

    profileinfos.findOne().then((data) => {
      res.status(200).json({
        result: "User has been successfully created",
        id: data.users,
        token: data.token,
      });
    });
  } catch (error) {
    res.status(500).json({
      result: "Cannot create a user",
      error: error.message,
    });
  }
});

// Route Signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body; // Vérification des champs obligatoires pour connexion

  if (!CheckBody(req.body, ["email", "password"])) {
    return res.status(400).json({
      result: "Connection failed, Missing or empty fields",
    });
  }

  try {
    // Recherche du profil d'authentification par email
    const profile = await profileinfos.findOne({ email });

    if (profile && bcrypt.compareSync(password, profile.password)) {
      // Si le mot de passe est correct, récupération de l'utilisateur associé

      res.status(200).json({
        result: "Connection successful",
        userType: profile.userType,
        token: profile.token,
      });
    } else {
      res.status(401).json({
        result: "Connection failed, User not found or wrong password",
      });
    }
  } catch (error) {
    res.status(500).json({
      result: "Connection failed",
      error: error.message,
    });
  }
});

// GET by token
router.get("/:token", (req, res) => {
  const token = req.params.token;

  profileinfos
    .findOne({ token: token })
    .populate("users")
    .then((data) => {
      if (data) {
        console.log("User found !");
        console.log(data);
        User.findOne({ _id: data.users }).then((userData) => {
          console.log(userData);
          res.status(200).json(userData);
        });
      } else {
        res.status(404).json({
          message: "User has not been found !",
        });
      }
    });
});

module.exports = router;
