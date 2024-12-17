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
router.post("/propositionEvent", (req, res) => {
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
            result: "Cannot create any event",
            error: "Missing or empty fields",
        });
        return;
    }

    // Event can be created into BBC DB only if user connexion is active ==> token + chercher user from the token
    profileinfos.findOne({ token: req.body.token })
        .then((data) => {
            if (!data) {
                return res.status(404).json({ error: "User not found" });
            }

            const profileinfosId = data._id; //clé étrangère lié à une autre clé "ProfileInfos" where we can get the userType

            const {
                title,
                theme,
                category,
                reference, // Algo to be created !!!
                image,
                eventDate,
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
                organizer: profileinfosId, // Foreign key
                title,
                theme,
                category,
                reference, // À générer si nécessaire
                image,
                eventDate,
                location,
                //minsizeGroup,
                //maxsizeGroup,
                sizeGroup,
                description,
                preferences:  {
                    age: "entre 30 et 30",
                    gender: "femme",
                    preferences: "gjkgjsij"}, 
                participants: [],
                isFinished: false,
            });

            newEvent
                .save()
                .then((data) => {
                    res.json({
                        result: "Event has been successfully created",
                        //eventId: newEvent._id, // Retourner l'ID de l'événement
                        event: data,
                    });
                })
                .catch((error) => {
                    res.status(500).json({
                        result: "Connection failed",
                        error: error.message,
                    });
                });
        })

        .catch((error) => {
            res.status(500).json({
                result: "Connection failed",
                error: "Internal Server Error",
            });
        });
});

// GET all events to display them within SearchEventsScreen -------------------------------------------------
// except events that are already done !
router.get("/allEvents", (req, res) => {
    Event.find()
        //.populate("organizer", "participants")
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
router.get("/byDate/:date", (req, res) => {
    Event.find()
        .then((data) => {
            console.log(data);
            const eventDate = req.params.date;
            const eventsByDate = data.filter(
                (event) =>
                    new Date(event.eventDate).toISOString().split("T")[0] ===
                    eventDate
            );
            if (eventsByDate.length > 0) {
                res.json({
                    result: eventsByDate,
                });
            } else {
                res.status(404).json({
                    message: "Ressources not found",
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
    Event.find({ location: location, isFinished: false })
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
    Event.find({ category: category, isFinished: false })
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

// PUT : modify event only if you are the organizater (clé étrangère) ---------------------------------------
router.put("/updateById/:id", async (req, res) => {
    const itemId = req.params.id;
    const updateFields = req.body; // Dynamic fields will come here

    try {
        // Update only the fields present in the request body
        const updatedItem = await Event.findByIdAndUpdate(
            itemId,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).send("Item not found");
        }

        res.status(200).json(updatedItem);
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
            res.json({ result: true });
        } else {
            res.json({ result: false, error: "Event not found" });
        }
    });
});

module.exports = router;
