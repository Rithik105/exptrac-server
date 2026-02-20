const {
  signUpService,
  loginService,
  refreshService,
  logoutService,
  logoutAllService,
  verifyOtpService,
  resetPasswordService,
  forgotPasswordService,
} = require("../services/auth.service");

const signup = async (req, res, next) => {
  try {
    const result = await signUpService(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await refreshService(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await logoutService(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    const result = await logoutAllService(req.user.id);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await forgotPasswordService(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const result = await verifyOtpService(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await resetPasswordService(req.body);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  signup,
  login,
  refresh,
  logout,
  logoutAll,
  resetPassword,
  forgotPassword,
  verifyOtp,
};
