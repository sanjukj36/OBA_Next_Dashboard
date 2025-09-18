/*
  Warnings:

  - You are about to drop the `GeofencePolygon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeofencePolygonAlerts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GeofencePolygon" DROP CONSTRAINT "GeofencePolygon_fk_vessel_fkey";

-- DropForeignKey
ALTER TABLE "GeofencePolygonAlerts" DROP CONSTRAINT "GeofencePolygonAlerts_fk_geofencepolygon_fkey";

-- DropTable
DROP TABLE "GeofencePolygon";

-- DropTable
DROP TABLE "GeofencePolygonAlerts";

-- CreateTable
CREATE TABLE "Geofence" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "alert_send" BOOLEAN DEFAULT false,
    "fence_type" BOOLEAN NOT NULL,
    "coordsArray" JSONB NOT NULL,
    "fk_vessel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Geofence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeofenceAlerts" (
    "id" SERIAL NOT NULL,
    "fk_geofence" INTEGER,
    "vesselTime" TIMESTAMP(3),
    "coordsArray" JSONB NOT NULL,
    "isAcknowledged" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeofenceAlerts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Geofence" ADD CONSTRAINT "Geofence_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeofenceAlerts" ADD CONSTRAINT "GeofenceAlerts_fk_geofence_fkey" FOREIGN KEY ("fk_geofence") REFERENCES "Geofence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
