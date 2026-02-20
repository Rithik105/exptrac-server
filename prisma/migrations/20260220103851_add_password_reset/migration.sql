/*
  Warnings:

  - You are about to drop the `PasswordResetOTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PasswordResetOTP" DROP CONSTRAINT "PasswordResetOTP_userId_fkey";

-- DropTable
DROP TABLE "PasswordResetOTP";

-- CreateTable
CREATE TABLE "PasswordResetTicket" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastRequestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PasswordResetTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetTicket_userId_key" ON "PasswordResetTicket"("userId");

-- AddForeignKey
ALTER TABLE "PasswordResetTicket" ADD CONSTRAINT "PasswordResetTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
