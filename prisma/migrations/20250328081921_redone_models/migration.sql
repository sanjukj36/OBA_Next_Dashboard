/*
  Warnings:

  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_fk_company_entity_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_fk_fleet_entity_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_fk_usergroup_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_fk_vessel_entity_fkey";

-- AlterTable
ALTER TABLE "Fleet" ADD COLUMN     "fk_created_by" INTEGER;

-- AlterTable
ALTER TABLE "Vessel" ADD COLUMN     "fk_created_by" INTEGER;

-- DropTable
DROP TABLE "UserGroup";

-- CreateTable
CREATE TABLE "_CompanyUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompanyUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FleetUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FleetUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_VesselUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VesselUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyUsers_B_index" ON "_CompanyUsers"("B");

-- CreateIndex
CREATE INDEX "_FleetUsers_B_index" ON "_FleetUsers"("B");

-- CreateIndex
CREATE INDEX "_VesselUsers_B_index" ON "_VesselUsers"("B");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_fk_created_by_fkey" FOREIGN KEY ("fk_created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_fk_created_by_fkey" FOREIGN KEY ("fk_created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vessel" ADD CONSTRAINT "Vessel_fk_created_by_fkey" FOREIGN KEY ("fk_created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyUsers" ADD CONSTRAINT "_CompanyUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyUsers" ADD CONSTRAINT "_CompanyUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FleetUsers" ADD CONSTRAINT "_FleetUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Fleet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FleetUsers" ADD CONSTRAINT "_FleetUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VesselUsers" ADD CONSTRAINT "_VesselUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VesselUsers" ADD CONSTRAINT "_VesselUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Vessel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
