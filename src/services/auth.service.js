const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma = require("../config/prisma");
const AppError = require("../model/appError");
const { hasData } = require("../utility/data");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utility/jwt");
const { sendEmail } = require("../utility/email");

const signUpService = async ({ name, email, password }) => {
  if (!hasData(email) || !hasData(name) || !hasData(password))
    throw new AppError(400, "Bad Request");

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) throw new AppError(409, "User Already Exists");

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

  if (!storedToken) throw new AppError(401, "Invalid Token");

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

  if (!storedToken) throw new AppError(401, "Invalid Token");

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

const forgotPasswordService = async ({ email }) => {
  if (!hasData(email)) throw new AppError(400, "Bad Request");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return { messgae: "Success " };

  const resetRecord = await prisma.PasswordResetTicket.findUnique({
    where: { userId: user.id },
  });

  const otp = crypto.randomInt(100000, 1000000).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  if (resetRecord) {
    const now = new Date();
    if ((now - resetRecord.lastRequestedAt) / 1000 < 60) {
      throw new AppError(429, "Too Many Requests");
    }
    await prisma.PasswordResetTicket.update({
      where: { userId: user.id },
      data: {
        otp: hashedOtp,
        attempts: 0,
        lastRequestedAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
  } else {
    await prisma.PasswordResetTicket.create({
      data: {
        otp: hashedOtp,
        userId: user.id,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
  }

  await sendEmail(email, otp);

  return {
    message: "Success",
  };
};

const verifyOtpService = async ({ email, otp }) => {
  if (!hasData(email) || !hasData(otp)) throw new AppError(400, "Bad Request");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(400, "Invalid Email");
  }

  const passwordResetRecord = await prisma.PasswordResetTicket.findUnique({
    where: { userId: user.id },
  });

  if (!passwordResetRecord) {
    throw new AppError(400, "Invalid OTP");
  }

  if (passwordResetRecord.expiresAt < new Date()) {
    throw new AppError(400, "OTP Expired");
  }

  if (passwordResetRecord.attempts >= 5) {
    throw new AppError(400, "Too Many Attempts");
  }

  const match = await bcrypt.compare(otp, passwordResetRecord.otp);

  if (!match) {
    await prisma.PasswordResetTicket.update({
      where: { id: passwordResetRecord.id },
      data: { attempts: { increment: 1 } },
    });
    throw new AppError(400, "Incorrect OTP");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, 10);

  await prisma.PasswordResetTicket.update({
    where: { id: passwordResetRecord.id },
    data: {
      token: hashedToken,
      tokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  return {
    message: "Success",
    resetToken: resetToken,
  };
};

const resetPasswordService = async ({ email, resetToken, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(400, "Invalid Email");
  }

  const passwordResetRecord = await prisma.PasswordResetTicket.findUnique({
    where: { userId: user.id },
  });

  if (passwordResetRecord.expiresAt < new Date()) {
    throw new AppError(
      400,
      "Invalid or expired reset request , Please request a new reset",
    );
  }
  const match = await bcrypt.compare(resetToken, passwordResetRecord.token);

  if (!match) {
    throw new AppError(
      400,
      "Invalid or expired reset request , Please request a new reset",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await prisma.PasswordResetTicket.delete({
    where: { id: passwordResetRecord.id },
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
  resetPasswordService,
  verifyOtpService,
  forgotPasswordService,
};
