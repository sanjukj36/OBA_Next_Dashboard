/*
  Warnings:

  - Added the required column `predictedValue` to the `FuelMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FuelMaster" ADD COLUMN     "predictedValue" DOUBLE PRECISION NOT NULL;
