var express = require("express");
var router = express.Router();
const { CheckBody } = require("../modules/checkbody");
const Event = require("../models/events");
//const User = require("../models/users");
const profileinfos = require("../models/profileinfos");
const User = require("../models/users");
const Organization = require("../models/organizations");
require("../models/connection");

// POST - when creating event via PropositionScreen ----------------------------------------------------------
router.post("/createEvent", (req, res) => {
  // Fill all fields to be able to set matches later on
  if (
    !CheckBody(req.body, [
      "title",
      "theme",
      "category",
      //"image",  pas bloquant
      "eventDate",
      "location",
      "sizeGroup",
      // "minSizeGroup",
      // "maxSizeGroup",
      //"preferences", pas bloquant si pas de préférances et pas envie de remplir côté FRONT
    ])
  ) {
    res.json({
      message: "Cannot create any event",
      error: "Missing or empty fields",
    });
    return;
  }
  const token = req.headers.authorization;
  // Event can be created into BBC DB only if user connexion is active ==> token + chercher user from the token
  profileinfos
    .findOne({ token: token })
    .then((data) => {
      if (!data) {
        return res.status(404).json({ error: "User not found" });
      }

      const profileinfosId = data._id; //clé étrangère lié à une autre clé "ProfileInfos" where we can get the userType

      const {
        title,
        theme,
        category,
        reference,
        image,
        eventDate, // Date Format is : DD-MM-YY
        location,
        // minsizeGroup,
        // maxsizeGroup,
        sizeGroup,
        description,
        //preferences, // S'assurer que preferencesId existe
        // participants, // foreign key: s'ajoute au fur et à mesure que les personnes s'inscrivent
      } = req.body;

      console.log(req.body);

      // Push (creation + save) event into events collection
      const newEvent = new Event({
        organizer: profileinfosId,
        title,
        theme,
        category,
        reference,
        image,
        eventDate,
        location,
        //minsizeGroup,
        //maxsizeGroup,
        sizeGroup,
        description,
        preferences: {
          ageRange: req.body.age,
          gender: req.body.gender,
          other: req.body.other,
        },
        participants: [],
        isFinished: false,
      });

      newEvent
        .save()
        .then((data) => {
          res.json({
            message: "Event has been successfully created",
            result: data,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Event couldn't be created, please try later ^_^",
            error: error.message,
          });
        });
    })

    .catch((error) => {
      res.status(500).json({
        message: "Connection failed, please try later",
        error: error.message,
      });
    });
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
    if (data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({
        message: "Event not found",
      });
    }
  });
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
