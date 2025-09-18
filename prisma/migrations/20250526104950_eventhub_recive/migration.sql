-- CreateTable
CREATE TABLE "VesselData" (
    "id" SERIAL NOT NULL,
    "payload" JSONB NOT NULL,
    "fk_vessel" INTEGER,

    CONSTRAINT "VesselData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VesselData" ADD CONSTRAINT "VesselData_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
