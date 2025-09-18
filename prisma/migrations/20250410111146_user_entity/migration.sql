/*
  Warnings:

  - The `fk_company_entity` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fk_fleet_entity` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fk_vessel_entity` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "fk_company_entity",
ADD COLUMN     "fk_company_entity" INTEGER[],
DROP COLUMN "fk_fleet_entity",
ADD COLUMN     "fk_fleet_entity" INTEGER[],
DROP COLUMN "fk_vessel_entity",
ADD COLUMN     "fk_vessel_entity" INTEGER[];
