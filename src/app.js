require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/error.handler");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use(errorHandler);

module.exports = app;
