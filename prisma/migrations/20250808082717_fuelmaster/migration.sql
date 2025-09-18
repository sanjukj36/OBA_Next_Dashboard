-- CreateTable
CREATE TABLE "FuelMaster" (
    "id" SERIAL NOT NULL,
    "fk_vessel" INTEGER,
    "payload" JSONB NOT NULL,
    "isAalert" BOOLEAN NOT NULL DEFAULT false,
    "fk_vessel_data" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vesselTimeStamp" INTEGER,
    "vesselTime" TIMESTAMP(3),

    CONSTRAINT "FuelMaster_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FuelMaster" ADD CONSTRAINT "FuelMaster_fk_vessel_data_fkey" FOREIGN KEY ("fk_vessel_data") REFERENCES "VesselData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelMaster" ADD CONSTRAINT "FuelMaster_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
