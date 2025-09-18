-- CreateTable
CREATE TABLE "VesselDataLive" (
    "id" SERIAL NOT NULL,
    "payload" JSONB NOT NULL,
    "fk_vessel" INTEGER,
    "vesselTime" TIMESTAMP(3),
    "vesselTimeStamp" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VesselDataLive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VesselDataLive_fk_vessel_vesselTime_idx" ON "VesselDataLive"("fk_vessel", "vesselTime");

-- CreateIndex
CREATE INDEX "VesselDataLive_vesselTime_idx" ON "VesselDataLive"("vesselTime");

-- AddForeignKey
ALTER TABLE "VesselDataLive" ADD CONSTRAINT "VesselDataLive_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
