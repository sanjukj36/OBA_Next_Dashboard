-- 🚀 CRITICAL: Run these SQL commands directly on your PostgreSQL database
-- These indexes cannot be created through Prisma but are essential for performance

-- 1. Create GIN indexes for JSON payload queries (PostgreSQL specific)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vessel_payload_gin 
ON "VesselData" USING GIN (payload);

-- 2. Create specific JSON path indexes for the most queried fields
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vessel_lat_json 
ON "VesselData" USING BTREE ((payload->>'V_GPSLAT_act_deg@LAST')) 
WHERE payload->>'V_GPSLAT_act_deg@LAST' IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vessel_lon_json 
ON "VesselData" USING BTREE ((payload->>'V_GPSLON_act_deg@LAST')) 
WHERE payload->>'V_GPSLON_act_deg@LAST' IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vessel_hdg_json 
ON "VesselData" USING BTREE ((payload->>'V_HDG_act_deg@AVG')) 
WHERE payload->>'V_HDG_act_deg@AVG' IS NOT NULL;

-- 3. Composite index for the most common query pattern
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vessel_timestamp_coords_composite
ON "VesselData" (fk_vessel, "vesselTimeStamp")
WHERE payload->>'V_GPSLAT_act_deg@LAST' IS NOT NULL 
  AND payload->>'V_GPSLON_act_deg@LAST' IS NOT NULL
  AND CAST(payload->>'V_GPSLAT_act_deg@LAST' AS NUMERIC) != 0
  AND CAST(payload->>'V_GPSLON_act_deg@LAST' AS NUMERIC) != 0;

-- 4. Enable parallel queries for large datasets
ALTER TABLE "VesselData" SET (parallel_workers = 4);

-- 5. Update table statistics for better query planning
ANALYZE "VesselData";

-- 6. Optional: Partition the table by vessel_id for even better performance (advanced)
-- This is recommended if you have millions of records per vessel
/*
-- Create partitioned table (run this carefully, requires data migration)
CREATE TABLE "VesselData_partitioned" (
    LIKE "VesselData" INCLUDING ALL
) PARTITION BY HASH (fk_vessel);

-- Create partitions (adjust number based on your vessel count)
CREATE TABLE "VesselData_part_0" PARTITION OF "VesselData_partitioned" FOR VALUES WITH (modulus 4, remainder 0);
CREATE TABLE "VesselData_part_1" PARTITION OF "VesselData_partitioned" FOR VALUES WITH (modulus 4, remainder 1);
CREATE TABLE "VesselData_part_2" PARTITION OF "VesselData_partitioned" FOR VALUES WITH (modulus 4, remainder 2);
CREATE TABLE "VesselData_part_3" PARTITION OF "VesselData_partitioned" FOR VALUES WITH (modulus 4, remainder 3);
*/

-- 7. PostgreSQL configuration recommendations
-- Add these to your postgresql.conf file and restart PostgreSQL:
/*
shared_buffers = 25% of RAM
effective_cache_size = 75% of RAM
work_mem = 256MB
maintenance_work_mem = 2GB
max_connections = 100
random_page_cost = 1.1
effective_io_concurrency = 200
*/