/*
  Warnings:

  - You are about to drop the column `MCR` on the `Vessel` table. All the data in the column will be lost.
  - Added the required column `mcr` to the `Vessel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vessel" DROP COLUMN "MCR",
ADD COLUMN     "mcr" DOUBLE PRECISION NOT NULL;
