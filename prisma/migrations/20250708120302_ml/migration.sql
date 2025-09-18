/*
  Warnings:

  - Added the required column `alarm_name` to the `MLAlarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MLAlarm" ADD COLUMN     "alarm_name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "MLAlarm_alarm_name_idx" ON "MLAlarm"("alarm_name");
