-- AlterTable
ALTER TABLE "GeofenceAlerts" ADD COLUMN     "fk_vessel_data" INTEGER;

-- AddForeignKey
ALTER TABLE "GeofenceAlerts" ADD CONSTRAINT "GeofenceAlerts_fk_vessel_data_fkey" FOREIGN KEY ("fk_vessel_data") REFERENCES "VesselData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
