const express = require("express");
const { verify } = require("../utility/email");

const testRoutes = express.Router();

testRoutes.get("/smtp_test", async (req, res) => {
  await verify(req, res);
});

module.exports = testRoutes;
