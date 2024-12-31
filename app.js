// Express and Cors import
const express = require("express");
const app = express();
const cors = require("cors");

// Dependency import
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { swaggerSpec, swaggerUi } = require("./configs/SwaggerConfig");
require("dotenv").config();

// Routes import
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const eventsRouter = require("./routes/events");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/doc/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/events", eventsRouter);

module.exports = app;
