/*
  Warnings:

  - Added the required column `MlResponse` to the `MLAlarm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MLAlarm" ADD COLUMN     "MlResponse" JSONB NOT NULL;
