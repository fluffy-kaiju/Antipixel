/*
  Warnings:

  - You are about to drop the column `createAt` on the `Antipixel` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Antipixel` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `TagOnAntipixel` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EUserAccountStatus" AS ENUM ('NOOB', 'PRO', 'ADMIN', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ETagsStatus" AS ENUM ('PENDING', 'ACTIVE', 'DELETED', 'FLAGGED');

-- DropForeignKey
ALTER TABLE "Antipixel" DROP CONSTRAINT "Antipixel_statusId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_statusId_fkey";

-- DropForeignKey
ALTER TABLE "TagOnAntipixel" DROP CONSTRAINT "TagOnAntipixel_statusId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_statusId_fkey";

-- DropIndex
DROP INDEX "Antipixel_statusId_key";

-- DropIndex
DROP INDEX "Tag_statusId_key";

-- DropIndex
DROP INDEX "TagOnAntipixel_antipixelId_key";

-- DropIndex
DROP INDEX "TagOnAntipixel_statusId_key";

-- DropIndex
DROP INDEX "TagOnAntipixel_tagName_key";

-- DropIndex
DROP INDEX "User_statusId_key";

-- AlterTable
ALTER TABLE "Antipixel" DROP COLUMN "createAt",
DROP COLUMN "statusId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "statusId";

-- AlterTable
ALTER TABLE "TagOnAntipixel" DROP COLUMN "statusId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "statusId",
ADD COLUMN     "status" "EUserAccountStatus" NOT NULL DEFAULT 'NOOB',
ADD COLUMN     "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Status";

-- DropEnum
DROP TYPE "EStatus";

-- CreateTable
CREATE TABLE "UserStatusHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "changeMadeByUserId" INTEGER NOT NULL,
    "status" "EUserAccountStatus" NOT NULL,
    "changeMadeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,

    CONSTRAINT "UserStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserStatusHistory" ADD CONSTRAINT "UserStatusHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStatusHistory" ADD CONSTRAINT "UserStatusHistory_changeMadeByUserId_fkey" FOREIGN KEY ("changeMadeByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
