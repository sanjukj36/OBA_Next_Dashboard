-- CreateTable
CREATE TABLE "GeofencePolygonAlerts" (
    "id" SERIAL NOT NULL,
    "fk_geofencepolygon" INTEGER,
    "vesselTime" TIMESTAMP(3),
    "coordsArray" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeofencePolygonAlerts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeofencePolygonAlerts" ADD CONSTRAINT "GeofencePolygonAlerts_fk_geofencepolygon_fkey" FOREIGN KEY ("fk_geofencepolygon") REFERENCES "GeofencePolygon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
