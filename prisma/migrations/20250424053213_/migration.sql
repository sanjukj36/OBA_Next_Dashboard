/*
  Warnings:

  - A unique constraint covering the columns `[fk_vessel]` on the table `TagMaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TagMaster_fk_vessel_key" ON "TagMaster"("fk_vessel");
