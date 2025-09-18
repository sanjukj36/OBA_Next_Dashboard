import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

// Check if a value is a valid number
function isValidNumber(value: any): boolean {
  return typeof value === "number" && !isNaN(value);
}

// Haversine distance in km
function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const fromDateParam = searchParams.get("from_date");
    const toDateParam = searchParams.get("to_date");
    const singleTimeParam = searchParams.get("time");
    const intervalParam = searchParams.get("interval"); // For data sampling

    const id = idParam ? parseInt(idParam) : null;
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Valid ID is required" },
        { status: 400 }
      );
    }

    const interval = intervalParam ? parseInt(intervalParam) : null; // Sampling interval in seconds

    // 🔹 Handle Single Timestamp Mode (Optimized)
    if (singleTimeParam && !fromDateParam && !toDateParam) {
      const timestamp = parseInt(singleTimeParam);
      if (!timestamp || isNaN(timestamp)) {
        return NextResponse.json(
          { success: false, message: "Invalid time value" },
          { status: 400 }
        );
      }

      // Optimized single query with proper casting and filtering
      const singleQuery = `
        SELECT
          "vesselTime",
          "vesselTimeStamp",
          CAST(payload->>'V_GPSLAT_act_deg@LAST' AS NUMERIC) AS "LAT",
          CAST(payload->>'V_GPSLON_act_deg@LAST' AS NUMERIC) AS "LON",
          ROUND(CAST(payload->>'V_HDG_act_deg@AVG' AS NUMERIC), 2) AS "HDG"
        FROM "VesselData"
        WHERE "fk_vessel" = $1 
          AND "vesselTimeStamp" = $2
          AND payload->>'V_GPSLAT_act_deg@LAST' IS NOT NULL
          AND payload->>'V_GPSLON_act_deg@LAST' IS NOT NULL
          AND CAST(payload->>'V_GPSLAT_act_deg@LAST' AS NUMERIC) != 0
          AND CAST(payload->>'V_GPSLON_act_deg@LAST' AS NUMERIC) != 0
        LIMIT 1
      `;

      const result = await prisma.$queryRawUnsafe<any[]>(
        singleQuery,
        id,
        timestamp
      );

      if (result.length === 0) {
        return NextResponse.json(
          { success: false, message: "No data found for given timestamp" },
          { status: 404 }
        );
      }

      const row = result[0];
      return NextResponse.json({
        success: true,
        data: [{
          time: row.vesselTime,
          timestamp: row.vesselTimeStamp,
          LAT: row.LAT,
          LON: row.LON,
          HDG: row.HDG
        }]
      });
    }

    // 🔹 Handle Range Query Mode (Heavily Optimized)
    const fromTimestamp = fromDateParam ? parseInt(fromDateParam) : null;
    const toTimestamp = toDateParam ? parseInt(toDateParam) : null;

    if (
      !fromTimestamp ||
      !toTimestamp ||
      isNaN(fromTimestamp) ||
      isNaN(toTimestamp)
    ) {
      return NextResponse.json(
        { success: false, message: "from_date and to_date must be valid Unix timestamps" },
        { status: 400 }
      );
    }

    // Build optimized query with optional sampling
    let rawQuery = `
      SELECT
        "vesselTime",
        "vesselTimeStamp",
        CAST(payload->>'V_GPSLAT_act_deg@LAST' AS NUMERIC) AS "LAT",
        CAST(payload->>'V_GPSLON_act_deg@LAST' AS NUMERIC) AS "LON",
        ROUND(CAST(payload->>'V_HDG_act_deg@AVG' AS NUMERIC), 2) AS "HDG"
      FROM "VesselData"
      WHERE "fk_vessel" = $1
        AND "vesselTimeStamp" BETWEEN $2 AND $3
        AND payload->>'V_GPSLAT_act_deg@LAST' IS NOT NULL
        AND payload->>'V_GPSLON_act_deg@LAST' IS NOT NULL
        AND CAST(payload->>'V_GPSLAT_act_deg@LAST' AS NUMERIC) != 0
        AND CAST(payload->>'V_GPSLON_act_deg@LAST' AS NUMERIC) != 0
    `;

    // Add sampling logic if interval is provided
    if (interval) {
      rawQuery += `
        AND ("vesselTimeStamp" % $4 = 0 OR "vesselTimeStamp" = (
          SELECT MIN("vesselTimeStamp") 
          FROM "VesselData" 
          WHERE "fk_vessel" = $1 AND "vesselTimeStamp" BETWEEN $2 AND $3
        ))
      `;
    }

    rawQuery += `
      ORDER BY "vesselTimeStamp" ASC
    `;

    const queryParams = interval 
      ? [id, fromTimestamp, toTimestamp, interval]
      : [id, fromTimestamp, toTimestamp];

    const results = await prisma.$queryRawUnsafe<any[]>(rawQuery, ...queryParams);

    // Data is already cleaned by the SQL query, minimal processing needed
    const cleaned = results.map((row) => ({
      time: row.vesselTime,
      timestamp: row.vesselTimeStamp,
      LAT: row.LAT,
      LON: row.LON,
      HDG: row.HDG,
    }));

    return NextResponse.json({
      success: true,
      data: cleaned,
      total: cleaned.length,
      ...(interval && { samplingInterval: interval })
    }, { status: 200 });

  } catch (error) {
    console.error("GET /vesselData error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}