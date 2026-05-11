/*
  Warnings:

  - You are about to drop the `AntiPixels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EStatus" AS ENUM ('PENDING', 'ACTIVE', 'DELETE', 'FLAG');

-- DropTable
DROP TABLE "AntiPixels";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "lastEditByUserId" INTEGER NOT NULL,
    "lastEditAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "EStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "TagOnAntipixel" (
    "tagName" TEXT NOT NULL,
    "antipixelId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "TagOnAntipixel_pkey" PRIMARY KEY ("tagName","antipixelId")
);

-- CreateTable
CREATE TABLE "HashToAntipixel" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,

    CONSTRAINT "HashToAntipixel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Antipixel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hashToAntipixelId" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "Antipixel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_statusId_key" ON "User"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_statusId_key" ON "Tag"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "TagOnAntipixel_tagName_key" ON "TagOnAntipixel"("tagName");

-- CreateIndex
CREATE UNIQUE INDEX "TagOnAntipixel_antipixelId_key" ON "TagOnAntipixel"("antipixelId");

-- CreateIndex
CREATE UNIQUE INDEX "TagOnAntipixel_statusId_key" ON "TagOnAntipixel"("statusId");

-- CreateIndex
CREATE UNIQUE INDEX "HashToAntipixel_hash_key" ON "HashToAntipixel"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Antipixel_statusId_key" ON "Antipixel"("statusId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnAntipixel" ADD CONSTRAINT "TagOnAntipixel_tagName_fkey" FOREIGN KEY ("tagName") REFERENCES "Tag"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnAntipixel" ADD CONSTRAINT "TagOnAntipixel_antipixelId_fkey" FOREIGN KEY ("antipixelId") REFERENCES "Antipixel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnAntipixel" ADD CONSTRAINT "TagOnAntipixel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagOnAntipixel" ADD CONSTRAINT "TagOnAntipixel_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antipixel" ADD CONSTRAINT "Antipixel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antipixel" ADD CONSTRAINT "Antipixel_hashToAntipixelId_fkey" FOREIGN KEY ("hashToAntipixelId") REFERENCES "HashToAntipixel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antipixel" ADD CONSTRAINT "Antipixel_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
