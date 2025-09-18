/*
  Warnings:

  - You are about to drop the column `build_yard` on the `Vessel` table. All the data in the column will be lost.
  - You are about to drop the column `cargo_capacity` on the `Vessel` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Vessel` table. All the data in the column will be lost.
  - You are about to drop the column `mcr` on the `Vessel` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Vessel` table. All the data in the column will be lost.
  - Added the required column `MCR` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dg_maker` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dg_model` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `flag` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geared_or_gearless` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `me_maker` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `me_model` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `port_of_regd` to the `Vessel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `power` to the `Vessel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vessel" DROP COLUMN "build_yard",
DROP COLUMN "cargo_capacity",
DROP COLUMN "country",
DROP COLUMN "mcr",
DROP COLUMN "model",
ADD COLUMN     "MCR" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dg_capacity_indvidual" INTEGER[],
ADD COLUMN     "dg_maker" TEXT NOT NULL,
ADD COLUMN     "dg_model" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "flag" TEXT NOT NULL,
ADD COLUMN     "geared_or_gearless" BOOLEAN NOT NULL,
ADD COLUMN     "me_maker" TEXT NOT NULL,
ADD COLUMN     "me_model" TEXT NOT NULL,
ADD COLUMN     "no_of_dg" INTEGER,
ADD COLUMN     "port_of_regd" TEXT NOT NULL,
ADD COLUMN     "power" DOUBLE PRECISION NOT NULL;
