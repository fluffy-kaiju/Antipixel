/*
  Warnings:

  - Made the column `antipixelId` on table `AntipixelStatusHistory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AntipixelStatusHistory" DROP CONSTRAINT "AntipixelStatusHistory_antipixelId_fkey";

-- AlterTable
ALTER TABLE "AntipixelStatusHistory" ALTER COLUMN "antipixelId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AntipixelStatusHistory" ADD CONSTRAINT "AntipixelStatusHistory_antipixelId_fkey" FOREIGN KEY ("antipixelId") REFERENCES "Antipixel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
