/*
  Warnings:

  - Changed the type of `year_built` on the `Vessel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vessel" DROP COLUMN "year_built",
ADD COLUMN     "year_built" INTEGER NOT NULL;
