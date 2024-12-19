const express = require("express");
const router = express.Router();
const { CheckBody } = require("../modules/checkbody");
const Event = require("../models/events");
//const User = require("../models/users");
const profileinfos = require("../models/profileinfos");
const User = require("../models/users");
const Organization = require("../models/organizations");
require("../models/connection");

// POST - when creating event via PropositionScreen ----------------------------------------------------------
router.post("/createEvent", async (req, res) => {
  const token = req.headers.authorization;

  try {
    const userData = await profileinfos.findOne({ token: token });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const profileinfosId = userData._id;

    const {
      title,
      theme,
      category,
      reference,
      image,
      eventDate,
      sizeGroup,
      description,
      adress,
      ageRange,
      gender,
      other,
    } = req.body;

    const requiredFields = [
      "title, theme, category, eventDate, sizeGroup, description, adress, ageRange, gender",
    ];

    if (!CheckBody(req.body, requiredFields)) {
      return res.json({
        result: "Cannot create a user",
        error: "Missing required fields",
      });
    }

    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${adress}&limit=1`
    );
    const data = await response.json();

    if (!data.features.length) {
      return res.status(404).json({ error: "Nothing has been found" });
    }

    const longitude = data.features[0].geometry.coordinates[0];
    const latitude = data.features[0].geometry.coordinates[1];

    console.log("Longitude :", longitude);
    console.log("Latitude :", latitude);

    const newEvent = new Event({
      organizer: profileinfosId,
      title,
      theme,
      category,
      reference,
      image,
      eventDate,
      location: {
        adress: adress,
        latitude: latitude,
        longitude: longitude,
      },
      sizeGroup,
      description,
      preferences: {
        ageRange: ageRange,
        gender: gender,
        other: other,
      },
      participants: [],
      isFinished: false,
    });

    await newEvent.save();

    res.status(201).json({ message: "Event created succesfully", newEvent });
  } catch (error) {
    console.error("Couldn't create an event :", error);
    res.status(500).json({
      message: "Server error, please try later.",
      error: error.message,
    });
  }
});

// GET all events to display them within SearchEventsScreen -------------------------------------------------
// except events that are already done !
router.get("/allEvents", (req, res) => {
  Event.find().then((data) => {
    if (data === null) {
      res.json({
        message: "Event not found",
      });
    } else if (data.isFinished) {
      res.json({
        message: "Event done",
      });
    } else if (!data.isFinished) {
      res.json({
        message: "Here's the list of the events 👇",
        result: data.filter((event) => event.isFinished !== true),
      });
    }
  });
});

// GET by using filter in front ---------------------------------------------------------------------
// // Get by date
router.get("/byDate/:date", (req, res) => {
  const eventDate = req.params.date;
  Event.find({ eventDate: eventDate, isFinished: false })
    .then((data) => {
      console.log(data);
      if (eventDate.length > 0) {
        res.json({
          result: data,
        });
      } else {
        res.status(404).json({
          message: "Ressources not found 😔",
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    });
});

// Get by location
router.get("/byLocation/:location", (req, res) => {
  const location = req.params.location;
  Event.find({ location: location, isFinished: false }).then((data) => {
    if (data.length > 0) {
      res.json({ result: data });
    } else {
      res.status(404).json({
        message: "Event not found 🕵️‍♀️",
      });
    }
  });
});

// // Get by sizeGroup
router.get("/bySizeGroup/:sizeGroup", (req, res) => {
  Event.find({ sizeGroup: req.params.sizeGroup, isFinished: false })
    .populate("organizer", "participants")
    .then((data) => {
      if (data.length > 0) {
        res.json(data);
      } else {
        res.status(404).json({
          message: "Event not found",
        });
      }
    });
});

// // GET by when selecting theme or category via button ---------------------------------------------------
// // Get by theme
router.get("/byTheme/:theme", (req, res) => {
  const theme = req.params.theme;
  Event.find({ theme: theme, isFinished: false })
    .populate("organizer", "participants")
    .then((data) => {
      if (data.length > 0) {
        res.json(data);
      } else {
        res.status(404).json({
          message: "Event not found",
        });
      }
    });
});

// // Get by category
router.get("/byCategory/:category", (req, res) => {
    const category = req.params.category;
    Event.find({ category: category, isFinished: false }).then((data) => {
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({
                message: "Event not found",
            });
        }
    });
});

// // Get by eventId
router.get("/byEventId/:id", (req, res) => {
    Event.findOne({_id: req.params.id}).then((foundEvent) => {
        if(foundEvent){
            res.json({message : "Event found", result: foundEvent})
        }
    })
});

// PUT : modify event only if you are the organizater (clé étrangère) ---------------------------------------
router.put("/updateById/:id", async (req, res) => {
  const itemId = req.params.id;
  const updateFields = req.body;

  try {
    // Update only the fields present in the request body
    const updatedItem = await Event.findByIdAndUpdate(
      itemId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).send("Item not found ⛔");
    }

    res.status(200).json({ result: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT update participant list
router.put("/participantEvent", (req, res) => {
  const token = req.headers.authorization;
  const { eventId } = req.body;
  // Event can be created into BBC DB only if user connexion is active ==> token + chercher user from the token
  profileinfos
    .findOne({ token: token })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }
      console.log(data);

      Event.findByIdAndUpdate(
        { _id: eventId },
        {
          $push: { participants: data.users },
        },
        { returnDocument: "after" }
      ).then((event) => {
        res.json({ event: event });
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Connection failed, please try later",
        error: error.message,
      });
    });
});

// DELETEONE only if organizer
// From Locapic Part 4 Challenge
router.delete("/deleteById/:id", (req, res) => {
  Event.deleteOne({ _id: req.params.id }).then((deletedEvent) => {
    if (deletedEvent.deletedCount > 0) {
      res.json({ message: "Event has been deleted ✅" });
    } else {
      res.json({ message: "Oof, we didn't find your events 🥹" });
    }
  });
});

module.exports = router;
