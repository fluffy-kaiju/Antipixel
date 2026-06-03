/*
  Warnings:

  - You are about to drop the `UserEmailConfirmation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserEmailConfirmation" DROP CONSTRAINT "UserEmailConfirmation_userId_fkey";

-- DropTable
DROP TABLE "UserEmailConfirmation";
