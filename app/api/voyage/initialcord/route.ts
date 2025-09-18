import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

function parseDateDDMMYYYYtoISO(dateStr: string): string | null {
  const [day, month, year] = dateStr.split("-").map(Number);
  if (!day || !month || !year) return null;
  const parsedDate = new Date(year, month - 1, day);
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  )
    return null;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
    const vesselIdParam = searchParams.get("id");
    const fromDateStrRaw = searchParams.get("from_date");
    const toDateStrRaw = searchParams.get("to_date");

    const vesselId = vesselIdParam ? parseInt(vesselIdParam) : null;
    if (!vesselId || isNaN(vesselId)) {
      return NextResponse.json(
        { success: false, message: "Valid vessel_id is required" },
        { status: 400 }
      );
    }

    const fromDateStr = fromDateStrRaw
      ? parseDateDDMMYYYYtoISO(fromDateStrRaw)
      : null;
    const toDateStr = toDateStrRaw
      ? parseDateDDMMYYYYtoISO(toDateStrRaw)
      : null;

    let startDate: string | null = null;
    let endDate: string | null = null;

    if (fromDateStr && toDateStr) {
      startDate = `${fromDateStr} 00:00:00`;
      endDate = `${toDateStr} 23:59:59`;
    }

    // ✅ Fetch oldest vesselData
    const oldestSql = `
      SELECT *
      FROM "VesselData"
      WHERE "fk_vessel" = $1
      ORDER BY "vesselTime" ASC
      LIMIT 1
    `;
    const [vesselData] = await prisma.$queryRawUnsafe<any[]>(
      oldestSql,
      vesselId
    );

    if (!vesselData) {
      return NextResponse.json(
        { success: false, message: "No data found for this vessel" },
        { status: 404 }
      );
    }

    // ✅ Map vesselTime to timestamp range
    let recordCount = 0;
    let vesselTimeToTimestampMap: { timestamp: number | null; time: string }[] =
      [];

    if (startDate && endDate) {
      const recordsSql = `
        SELECT "vesselTime", "vesselTimeStamp"
        FROM "VesselData"
        WHERE "fk_vessel" = $1
          AND "vesselTime" BETWEEN $2::timestamp AND $3::timestamp
        ORDER BY "vesselTime" ASC
      `;
      const results = await prisma.$queryRawUnsafe<any[]>(
        recordsSql,
        vesselId,
        startDate,
        endDate
      );
      recordCount = results.length;
      vesselTimeToTimestampMap = results.map(row => ({
        timestamp: row.vesselTimeStamp ?? null,
        time: row.vesselTime?.toISOString() ?? null
      }));
    }

    // ✅ Parse payload
    const parsedPayload =
      typeof vesselData.payload === "string"
        ? JSON.parse(vesselData.payload)
        : vesselData.payload;

    const tagParams: Record<string, string> = {
      LAT: "V_GPSLAT_act_deg@LAST",
      LONG: "V_GPSLON_act_deg@LAST",
      HDG: "V_HDG_act_deg@AVG"
    };

    // ✅ Fetch tagMaster to validate tag existence if needed
    const tagSql = `
      SELECT *
      FROM "TagMaster"
      WHERE "fk_vessel" = $1
    `;
    const tagMasters = await prisma.$queryRawUnsafe<any[]>(tagSql, vesselId);

    const responseData: Record<string, any> = {};
    for (const [key, tag] of Object.entries(tagParams)) {
      let value = parsedPayload?.[tag];
      if (typeof value === "number" && !Number.isInteger(value)) {
        value = Number.parseFloat(value.toFixed(2));
      }
      responseData[key] = value ?? null;
    }

    // ✅ Time info from vesselTime
    let timeInfo = null;
    if (vesselData.vesselTime) {
      const now = new Date();
      const timeDiffSeconds = Math.floor(
        (now.getTime() - new Date(vesselData.vesselTime).getTime()) / 1000
      );
      timeInfo = {
        vessel_time: new Date(vesselData.vesselTime).toISOString(),
        time_difference_seconds: timeDiffSeconds
      };
    }

    return NextResponse.json(
      {
        success: true,
        vessel_id: vesselId,
        data: {
          responseData,
          timeInfo,
          recordCount,
          vesselTimeToTimestampMap
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /vesseldata oldest error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
