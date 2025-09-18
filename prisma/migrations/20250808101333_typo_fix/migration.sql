/*
  Warnings:

  - You are about to drop the column `isAalert` on the `FuelMaster` table. All the data in the column will be lost.
  - Added the required column `isAlert` to the `FuelMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FuelMaster" DROP COLUMN "isAalert",
ADD COLUMN     "isAlert" BOOLEAN NOT NULL;
