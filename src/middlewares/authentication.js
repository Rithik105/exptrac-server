const { verifyAccessToken } = require("../utility/jwt");
const AppError = require("../model/appError");

const authentication = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (token) {
      req.user = verifyAccessToken(token);
      console.log(req.user);
      next();
    } else {
      throw AppError(401, "Unauthorized");
    }
  } catch (e) {
    next(e);
  }
};

module.exports = authentication;
