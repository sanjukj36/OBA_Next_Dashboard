-- CreateTable
CREATE TABLE "GeofencePolygon" (
    "id" INTEGER NOT NULL,
    "coordsArray" JSONB NOT NULL,
    "fk_vessel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeofencePolygon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeofencePolygon" ADD CONSTRAINT "GeofencePolygon_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
