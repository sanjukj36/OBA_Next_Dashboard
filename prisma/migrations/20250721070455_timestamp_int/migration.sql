/*
  Warnings:

  - The `vesselTimeStamp` column on the `VesselData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "VesselData" DROP COLUMN "vesselTimeStamp",
ADD COLUMN     "vesselTimeStamp" INTEGER;
