/*
  Warnings:

  - Added the required column `entity_type` to the `UserTypePriv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserTypePriv" ADD COLUMN     "entity_type" TEXT NOT NULL;
