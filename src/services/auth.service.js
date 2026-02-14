const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const AppError = require("../model/appError");
const { hasData } = require("../utility/data");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utility/jwt");

const signUpService = async ({ name, email, password }) => {
  if (!hasData(email) || !hasData(name) || !hasData(password))
    throw new AppError(400, "Bad Request");

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) throw new AppError(409, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    message: "Success",
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const loginService = async ({ email, password }) => {
  if (!hasData(email) || !hasData(password))
    throw new AppError(400, "Bad Request");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(401, "Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError(401, "Incorrect Password");

  const refreshToken = generateRefreshToken(user.id);
  const accessToken = generateAccessToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  return {
    message: "Success",
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const refreshService = async ({ refreshToken }) => {
  if (!hasData(refreshToken)) throw new AppError(400, "Bad Request");

  verifyRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) throw new AppError(401, "Invalid token");

  const accessToken = generateAccessToken(storedToken.userId);

  return {
    message: "Success",
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const logoutService = async ({ refreshToken }) => {
  if (!hasData(refreshToken)) throw new AppError(400, "Bad Request");

  verifyRefreshToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) throw new AppError(401, "Invalid token");

  await prisma.refreshToken.delete({
    where: {
      id: storedToken.id,
    },
  });

  return {
    message: "Success",
  };
};

const logoutAllService = async (userId) => {
  if (!hasData(userId)) throw new AppError(400, "Bad Request");

  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });

  return {
    message: "Success",
  };
};

module.exports = {
  signUpService,
  loginService,
  refreshService,
  logoutService,
  logoutAllService,
};
