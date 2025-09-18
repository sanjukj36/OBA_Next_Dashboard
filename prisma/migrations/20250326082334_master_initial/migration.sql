/*
  Warnings:

  - You are about to drop the column `userGroupId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserGroup` table. All the data in the column will be lost.
  - You are about to drop the column `delete_perm` on the `UserGroup` table. All the data in the column will be lost.
  - You are about to drop the column `edit_perm` on the `UserGroup` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `UserGroup` table. All the data in the column will be lost.
  - You are about to drop the column `read_perm` on the `UserGroup` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserGroup` table. All the data in the column will be lost.
  - You are about to drop the column `write_perm` on the `UserGroup` table. All the data in the column will be lost.
  - Added the required column `entity` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `access` to the `UserGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_type` to the `UserGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userGroupId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userGroupId",
ADD COLUMN     "entity" TEXT NOT NULL,
ADD COLUMN     "expiry" TIMESTAMP(3),
ADD COLUMN     "fk_company_entity" INTEGER,
ADD COLUMN     "fk_fleet_entity" INTEGER,
ADD COLUMN     "fk_usergroup" INTEGER,
ADD COLUMN     "fk_vessel_entity" INTEGER,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserGroup" DROP COLUMN "createdAt",
DROP COLUMN "delete_perm",
DROP COLUMN "edit_perm",
DROP COLUMN "isDeleted",
DROP COLUMN "read_perm",
DROP COLUMN "updatedAt",
DROP COLUMN "write_perm",
ADD COLUMN     "access" TEXT NOT NULL,
ADD COLUMN     "user_type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fleet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vessel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "vessel_type" TEXT NOT NULL,
    "imo" TEXT NOT NULL,
    "hull_no" TEXT NOT NULL,
    "year_built" TEXT NOT NULL,
    "cargo_capacity" TEXT NOT NULL,
    "build_yard" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "mcr" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "fk_company" INTEGER,
    "fk_fleet" INTEGER,

    CONSTRAINT "Vessel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_country_key" ON "Company"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Fleet_name_key" ON "Fleet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Fleet_email_key" ON "Fleet"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vessel_name_key" ON "Vessel"("name");

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_fk_company_fkey" FOREIGN KEY ("fk_company") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_fk_fleet_fkey" FOREIGN KEY ("fk_fleet") REFERENCES "Fleet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fk_usergroup_fkey" FOREIGN KEY ("fk_usergroup") REFERENCES "UserGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fk_company_entity_fkey" FOREIGN KEY ("fk_company_entity") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fk_fleet_entity_fkey" FOREIGN KEY ("fk_fleet_entity") REFERENCES "Fleet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_fk_vessel_entity_fkey" FOREIGN KEY ("fk_vessel_entity") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
