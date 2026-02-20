-- AlterTable
ALTER TABLE "PasswordResetTicket" ALTER COLUMN "token" DROP NOT NULL,
ALTER COLUMN "tokenExpiresAt" DROP NOT NULL;
