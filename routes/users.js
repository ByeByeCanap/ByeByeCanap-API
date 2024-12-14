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
        firstName,
        lastName,
        email,
        nickName,
        password,
        userType, // reducer --> recupérer depuis la page UserTypeScreen
        birthDate,
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

    console.log("look at req.body", req.body);
    
    // Check required fields
    const requiredFields = [
        "nickName",
        "email",
        "password",
        "userType",
        "lastName",
        "firstName",
        "birthDate",
        "gender",
    ];
    if (!CheckBody(req.body, requiredFields)) {
        //const emptyField = requiredFields.value
        return res.json({
            result: "Cannot create a user",
            error: "Missing required fields",
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ nickName });
        if (existingUser) {
            return res.json({
                result: "Cannot create a user",
                error: "Nickname already exists",
            });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create ProfileInfos
        const newProfileInfos = new ProfileInfos({
            email,
            password: hashedPassword,
            userType,
            token: uid2(32),
        });

        const savedProfileInfos = await newProfileInfos.save();

        // Create User and link ProfileInfos

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
            birthDate: birthDate,
            gender,
            aspirations: userAspirations,
            motivations: motivations || null,
            availability: userAvailability,
            values: userValues,
            suggestions: suggestions || null,
            profileInfos: savedProfileInfos._id, // Link to ProfileInfos
            descriptionProfile: descriptionProfile,
        });

        const savedUser = await newUser.save();

        // Update ProfileInfos to link back to User
        savedProfileInfos.users = savedUser._id;
        await savedProfileInfos.save();

        res.json({
            result: "User has been successfully created",
            userId: savedUser._id,
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
            const user = await User.findOne({
                profileInfos: profile._id,
            }).populate("profileInfos");

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
        res.status(500).json({
            result: "Connection failed",
            error: error.message,
        });
    }
});

module.exports = router;
