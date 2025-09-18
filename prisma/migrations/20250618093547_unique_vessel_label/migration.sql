/*
  Warnings:

  - A unique constraint covering the columns `[fk_vessel,label]` on the table `TagMasterManual` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TagMasterManual_fk_vessel_label_key" ON "TagMasterManual"("fk_vessel", "label");
