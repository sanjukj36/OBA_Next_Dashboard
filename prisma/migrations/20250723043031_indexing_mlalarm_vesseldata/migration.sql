-- CreateIndex
CREATE INDEX "MLAlarm_fk_vessel_idx" ON "MLAlarm"("fk_vessel");

-- CreateIndex
CREATE INDEX "MLAlarm_fk_vessel_data_idx" ON "MLAlarm"("fk_vessel_data");

-- CreateIndex
CREATE INDEX "VesselData_vesselTime_idx" ON "VesselData"("vesselTime");
