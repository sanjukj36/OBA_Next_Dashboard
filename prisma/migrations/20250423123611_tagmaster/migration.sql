-- CreateTable
CREATE TABLE "TagMaster" (
    "id" SERIAL NOT NULL,
    "tag_from_vessel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actual_tag" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "minimum" TEXT NOT NULL,
    "maximum" TEXT NOT NULL,
    "datatype" TEXT NOT NULL,
    "alarm" BOOLEAN NOT NULL DEFAULT false,
    "alarm_priority" TEXT NOT NULL,
    "fk_vessel" INTEGER,

    CONSTRAINT "TagMaster_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TagMaster" ADD CONSTRAINT "TagMaster_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
