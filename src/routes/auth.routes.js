const authentication = require("../middlewares/authentication");
const express = require("express");
const {
  signup,
  login,
  refresh,
  logout,
  logoutAll,
} = require("../controllers/auth.controller");

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);
authRoutes.post("/logout-all", authentication, logoutAll);

module.exports = authRoutes;
