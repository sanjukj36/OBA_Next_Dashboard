/*
  Warnings:

  - You are about to drop the column `actual_tag` on the `TagMaster` table. All the data in the column will be lost.
  - You are about to drop the column `alarm` on the `TagMaster` table. All the data in the column will be lost.
  - You are about to drop the column `alarm_priority` on the `TagMaster` table. All the data in the column will be lost.
  - You are about to drop the column `datatype` on the `TagMaster` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `TagMaster` table. All the data in the column will be lost.
  - You are about to drop the column `maximum` on the `TagMaster` table. All the data in the column will be lost.
  - You are about to drop the column `minimum` on the `TagMaster` table. All the data in the column will be lost.
  - You are about to drop the column `tag_from_vessel` on the `TagMaster` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `TagMaster` table. All the data in the column will be lost.
  - Added the required column `tag_data` to the `TagMaster` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TagMaster" DROP COLUMN "actual_tag",
DROP COLUMN "alarm",
DROP COLUMN "alarm_priority",
DROP COLUMN "datatype",
DROP COLUMN "description",
DROP COLUMN "maximum",
DROP COLUMN "minimum",
DROP COLUMN "tag_from_vessel",
DROP COLUMN "unit",
ADD COLUMN     "tag_data" JSONB NOT NULL;
