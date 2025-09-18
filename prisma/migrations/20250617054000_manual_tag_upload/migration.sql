-- CreateTable
CREATE TABLE "TagMasterManual" (
    "id" SERIAL NOT NULL,
    "tag_data" JSONB NOT NULL,
    "fk_vessel" INTEGER,

    CONSTRAINT "TagMasterManual_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TagMasterManual_fk_vessel_key" ON "TagMasterManual"("fk_vessel");

-- AddForeignKey
ALTER TABLE "TagMasterManual" ADD CONSTRAINT "TagMasterManual_fk_vessel_fkey" FOREIGN KEY ("fk_vessel") REFERENCES "Vessel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
