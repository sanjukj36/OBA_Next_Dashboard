-- AlterTable
ALTER TABLE "UserTypePriv" ADD COLUMN     "fk_company" INTEGER,
ADD COLUMN     "fk_fleet" INTEGER,
ADD COLUMN     "fk_vessel" INTEGER;

-- AddForeignKey
ALTER TABLE "UserTypePriv" ADD CONSTRAINT "UserTypePriv_fk_company_fkey" FOREIGN KEY ("fk_company") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTypePriv" ADD CONSTRAINT "UserTypePriv_fk_fleet_fkey" FOREIGN KEY ("fk_fleet") REFERENCES "Fleet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTypePriv" ADD CONSTRAINT "UserTypePriv_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
