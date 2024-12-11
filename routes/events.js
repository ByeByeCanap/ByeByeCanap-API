var express = require("express");
var router = express.Router();
const { CheckBody } = require("../modules/checkbody");
const Event = require("../models/events");
//const User = require("../models/users");
const ProfileInfos = require("../models/profileInfos");
require("../models/connection");

// POST - when creating event via PropositionScreen ----------------------------------------------------------

// router.post("/proposition", (req, res) => {
//     // Fill all fields to be able to set matches later on
//     if (
//         !CheckBody(req.body, [
//             "title",
//             "theme",
//             "category",
//             //"image",  pas bloquant
//             "eventDate",
//             "location",
//             // "minSizeGroup",
//             // "maxSizeGroup",
//             "sizeGroup",
//             // "preferences", pas bloquant
//         ])
//     ) {
//         res.json({
//             result: "Cannot create any event",
//             error: "Missing or empty fields",
//         });
//         return;
//     }
//     // Event can be created into BBC DB only if user connexion is active ==> token
//     ProfileInfos.findOne({ token: req.body.token }).then((data) => {
//         if (data === null) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         const {
//             organiser, // clé étrangère: SOIT user SOIT organization
//             title,
//             theme,
//             category,
//             reference, // A nous de le créer
//             image,
//             eventDate,
//             location,
//             // minsizeGroup,
//             // maxsizeGroup,
//             sizeGroup,
//             preferences,
//             participants, // clé étrangère: s'ajoute au fur et à mesure que les personnes s'inscrivent
//         } = req.body;

//         // Push (creation + save) event into events collection
//         const newEvent = new Event({
//             organiser, // still question
//             title,
//             theme,
//             category,
//             reference,
//             image,
//             eventDate,
//             location,
//             //minsizeGroup,
//             //maxsizeGroup,
//             sizeGroup,
//             preferences: {
//                 age: req.body.age,
//                 gender: req.body.gender,
//                 other: req.body.other,
//             },
//             participants: [],
//             isFinished: false,
//         });
//         newEvent.save();
//         res.json({
//             result: "Event has been successfully created",
//             events: data,
//         });
//     });
// });

// GET all events to display them within SearchEventsScreen -------------------------------------------------
// except events that are already done !
router.get("/allEvents", (req, res) => {
    Event.find()
        .populate("organizer", "participants")
        .then((data) => {
            if (data === null) {
                res.json({
                    result: "Event not found",
                });
            } else if (data.isFinished) {
                res.json({
                    result: "Event done",
                });
            } else if (!data.isFinished) {
                res.json({
                    result: "Access to event has been successful",
                    events: data.filter((event) => event.isFinished !== true),
                });
            }
        });
});

// GET by using filter in front ---------------------------------------------------------------------
// // Get by date
// router.get("/byDate/:date", (req, res) => {
//     Event.find().then((data) => {
//         console.log(data);
//         const eventDate = req.params.date;
//         const eventsByDate = data.filter(
//             (event) => new Date(event.eventDate).toISOString().split('T')[0] === eventDate
//         );
//         if (eventsByDate.length > 0) {
//             res.json({
//                 result: eventsByDate,
//             });
//         } else {
//             res.status(404).json({
//                 message: "Ressources not found",
//             });
//         }
//     }).catch((error) => {
//         console.error(error);
//         res.status(500).json({ error: "An error occurred" });
//     });
// });

// // Get by location
// router.get("/byLocation/:location", (req, res) => {
//     Event.find()
//         .populate("organizer", "participants")
//         .then((data) => {
//             const location = req.params.location;
//             const eventsByLocation = data.filter(
//                 (event) => event.location === location
//             );
//             if (eventsByLocation.length > 0) {
//                 res.json({ eventsByLocation });
//             } else {
//                 res.status(404).json({
//                     message: "Ressources not found",
//                 });
//             }
//         });
// });

// // Get by sizeGroup
// router.get("/bySizeGroup/:sizeGroup", (req, res) => {
//     Event.find()
//         .populate("organizer", "participants")
//         .then((data) => {
//             if (!data.isFinished) {
//                 const { sizeGroup } = req.params;
//                 const eventsBySizeGroup = data.filter(
//                     (event) => event.sizeGroup === sizeGroup
//                 );
//                 res.json({ eventsBySizeGroup });
//             }
//         });
// });

// // GET by when selecting theme or category via button ---------------------------------------------------
// // Get by theme
// router.get("/byTheme/:theme", (req, res) => {
//     Event.find()
//         .populate("organizer", "participants")
//         .then((data) => {
//             if (!data.isFinished) {
//                 const { theme } = req.params;
//                 const eventsByTheme = data.filter(
//                     (event) => event.theme === theme
//                 );
//                 res.json({ eventsByTheme });
//             }
//         });
// });

// // Get by category
// router.get("/byCategory/:category", (req, res) => {
//     Event.find()
//         .populate("organizer", "participants")
//         .then((data) => {
//             if (!data.isFinished) {
//                 const { category } = req.params;
//                 const eventsByCategory = data.filter(
//                     (event) => event.category === category
//                 );
//                 res.json({ eventsByCategory });
//             }
//         });
// });

// PUT : modify event only if you are the organizater (clé étrangère) ---------------------------------------
router.put('/updateById/:id', async (req, res) => {
  const itemId = req.params.id;
  const updateFields = req.body; // Dynamic fields will come here

  try {
    // Update only the fields present in the request body
    const updatedItem = await Event.findByIdAndUpdate(itemId, { $set: updateFields }, { new: true });

    if (!updatedItem) {
      return res.status(404).send('Item not found');
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETEONE only if organizer
router.delete("/deleteById/:id", (req, res) => {
    Event.deleteOne({ _id: req.params.id }).then(() => {
        Event.find().then((data) => {
            res.json({ result: "Event has been deleted" });
        });
    });
});

module.exports = router;
