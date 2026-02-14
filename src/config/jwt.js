const ACCESS_SECRET = process.env.ACCESS_SECRET || "";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "";

const ACCESS_OPTIONS = { expiresIn: "15m" };
const REFRESH_OPTIONS = { expiresIn: "7d" };

module.exports = {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_OPTIONS,
  REFRESH_OPTIONS,
};
