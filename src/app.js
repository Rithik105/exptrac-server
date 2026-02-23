require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/error.handler");
const testRoutes = require("./routes/test.routes");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use(errorHandler);
app.use("/test", testRoutes);

module.exports = app;
