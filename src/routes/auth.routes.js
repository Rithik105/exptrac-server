const authentication = require("../middlewares/authentication");
const express = require("express");
const {
  signup,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  verifyOtp,
} = require("../controllers/auth.controller");

const authRoutes = express.Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", logout);
authRoutes.post("/logout-all", authentication, logoutAll);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/reset-password", resetPassword);

module.exports = authRoutes;
