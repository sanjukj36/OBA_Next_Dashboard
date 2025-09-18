-- AlterTable
CREATE SEQUENCE geofencepolygon_id_seq;
ALTER TABLE "GeofencePolygon" ALTER COLUMN "id" SET DEFAULT nextval('geofencepolygon_id_seq');
ALTER SEQUENCE geofencepolygon_id_seq OWNED BY "GeofencePolygon"."id";
