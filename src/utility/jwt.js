const jwt = require("jsonwebtoken");
const AppError = require("../model/appError");
const { hasData } = require("../utility/data");

const {
  ACCESS_SECRET,
  ACCESS_OPTIONS,
  REFRESH_OPTIONS,
  REFRESH_SECRET,
} = require("../config/jwt");

const generateAccessToken = (userId) => {
  if (hasData(ACCESS_SECRET)) {
    return jwt.sign({ id: userId }, ACCESS_SECRET, ACCESS_OPTIONS);
  } else {
    throw new AppError(500, "Access secret not configured");
  }
};

const generateRefreshToken = (userId) => {
  if (hasData(REFRESH_SECRET)) {
    return jwt.sign(
      {
        id: userId,
      },
      REFRESH_SECRET,
      REFRESH_OPTIONS,
    );
  } else {
    throw new AppError(500, "Refresh secret not configured");
  }
};

const verifyAccessToken = (token) => {
  try {
    if (hasData(ACCESS_SECRET)) {
      return jwt.verify(token, ACCESS_SECRET);
    } else {
      throw new AppError(500, "Access secret not configured");
    }
  } catch (e) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token expired", 401);
    } else if (err.name === "JsonWebTokenError") {
      throw new AppError("Invalid token", 401);
    } else {
      throw e;
    }
  }
};

const verifyRefreshToken = (token) => {
  try {
    if (hasData(REFRESH_SECRET)) {
      return jwt.verify(token, REFRESH_SECRET);
    } else {
      throw new AppError(500, "Refresh secret not configured");
    }
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      throw new AppError(401, "Token expired");
    } else if (e.name === "JsonWebTokenError") {
      throw new AppError(401, "Invalid token");
    } else {
      throw e;
    }
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
