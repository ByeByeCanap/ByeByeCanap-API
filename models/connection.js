// 1 - Importer Mongoose
const mongoose = require("mongoose");

// 2- Connexion Moongoose
const connectionString = process.env.CONNECTION_STRING;

// 3- Defini délai et ajouter msg en case d'erreur
mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
