/*
  Warnings:

  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TagOnAntipixel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tagName` on the `TagOnAntipixel` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `statusUpdatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tagId` to the `TagOnAntipixel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EVirusScanStatus" AS ENUM ('PENDING', 'SCANNING', 'SAFE', 'UNSAFE');

-- DropForeignKey
ALTER TABLE "TagOnAntipixel" DROP CONSTRAINT "TagOnAntipixel_tagName_fkey";

-- DropIndex
DROP INDEX "Tag_name_key";

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "status" "ETagsStatus" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TagOnAntipixel" DROP CONSTRAINT "TagOnAntipixel_pkey",
DROP COLUMN "tagName",
ADD COLUMN     "tagId" INTEGER NOT NULL,
ADD CONSTRAINT "TagOnAntipixel_pkey" PRIMARY KEY ("tagId", "antipixelId");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "statusUpdatedAt",
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionOnRole" (
    "permissionId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "PermissionOnRole_pkey" PRIMARY KEY ("permissionId","roleId")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdByUserId" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsStatusHistory" (
    "id" SERIAL NOT NULL,
    "tagId" INTEGER NOT NULL,
    "changeMadeByUserId" INTEGER NOT NULL,
    "status" "ETagsStatus" NOT NULL,
    "changeMadeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,

    CONSTRAINT "TagsStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "PermissionOnRole" ADD CONSTRAINT "PermissionOnRole_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermissionOnRole" ADD CONSTRAINT "PermissionOnRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsStatusHistory" ADD CONSTRAINT "TagsStatusHistory_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsStatusHistory" ADD CONSTRAINT "TagsStatusHistory_changeMadeByUserId_fkey" FOREIGN KEY ("changeMadeByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnAntipixel" ADD CONSTRAINT "TagOnAntipixel_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
