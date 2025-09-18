/*
  Warnings:

  - You are about to drop the column `class` on the `Vessel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vessel" DROP COLUMN "class",
ADD COLUMN     "vessel_class" TEXT;
