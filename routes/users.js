var express = require("express");
var router = express.Router();
const { CheckBody } = require("../modules/checkbody");
const User = require("../models/users");
const ProfileInfos = require("../models/profileInfos");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
require("../models/connection");

router.post("/signup", (req, res) => {
  if (
    !CheckBody(req.body, [
      "nickName",
      "email",
      "password",
      "lastName",
      "firstName",
      "birthdate",
      "gender",
    ])
  ) {
    res.json({
      result: "Cannot create an user",
      error: "Missing or empty fields",
    });
    return;
  }

  User.findOne({ nickname: req.body.nickname, email: req.body.email }).then(
    (data) => {
      if (data === null) {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const body = req.body;
        const newUser = new User({
          lastName: body.firstname,
          firstName: body.firstName,
          nickName: body.nickName,
          birthdate: body.birthdate,
          gender: body.gender,
        });
        newUser.save();
        const newProfileInfos = new ProfileInfos({
          email: body.email,
          password: hash,
          token: uid2(32),
          inscriptionDate: new Date(), // Ajout de la date d'inscription
        });
        newProfileInfos.save();
        res.json({
          result: "User has been successfully created",
        });
      } else {
        res.json({
          result: "Cannot create an user",
          error:
            "User with the same email adress or/and with the same Username already exist",
        });
      }
    }
  );
});

router.post("/signin", (req, res) => {
  if (!CheckBody(req.body, ["email", "password"])) {
    res.json({ result: "Connection failed", error: "Missing or empty fields" });
    return;
  }

  ProfileInfos.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: data });
    } else {
      res.json({
        result: "Connection failed",
        error: "User not found or wrong password",
      });
    }
  });
});

module.exports = router;
