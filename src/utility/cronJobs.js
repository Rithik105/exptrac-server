const cronJob = require("node-cron");
const prisma = require("../config/prisma");

cronJob.schedule("0 0 * * *", async () => {
  console.log("Token Cleaning in Progress");
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
});
