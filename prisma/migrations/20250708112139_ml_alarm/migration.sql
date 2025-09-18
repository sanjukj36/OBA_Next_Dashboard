-- CreateTable
CREATE TABLE "MLAlarm" (
    "id" SERIAL NOT NULL,
    "fk_vessel_data" INTEGER,
    "fk_vessel" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MLAlarm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MLAlarm" ADD CONSTRAINT "MLAlarm_fk_vessel_data_fkey" FOREIGN KEY ("fk_vessel_data") REFERENCES "VesselData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MLAlarm" ADD CONSTRAINT "MLAlarm_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
