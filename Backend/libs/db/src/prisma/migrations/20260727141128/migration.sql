/*
  Warnings:

  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PermissionOnRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EAntipixelStatus" AS ENUM ('OPEN', 'LOCKED');

-- DropForeignKey
ALTER TABLE "PermissionOnRole" DROP CONSTRAINT "PermissionOnRole_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "PermissionOnRole" DROP CONSTRAINT "PermissionOnRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "Antipixel" ADD COLUMN     "status" "EAntipixelStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "AntipixelStatusHistory" ADD COLUMN     "antipixelId" INTEGER;

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "PermissionOnRole";

-- DropTable
DROP TABLE "Role";

-- AddForeignKey
ALTER TABLE "AntipixelStatusHistory" ADD CONSTRAINT "AntipixelStatusHistory_antipixelId_fkey" FOREIGN KEY ("antipixelId") REFERENCES "Antipixel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
