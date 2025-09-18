import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse) return authResult;
  if (!authResult) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const alarmId = searchParams.get("id");
    const tag = searchParams.get("tag");
    const timestampStr = searchParams.get("date");

    if (!alarmId || !tag || !timestampStr) {
      return NextResponse.json(
        { success: false, message: "id, tag, and date are required" },
        { status: 400 }
      );
    }

    const timestamp = parseInt(timestampStr);
    if (isNaN(timestamp)) {
      return NextResponse.json(
        { success: false, message: "Invalid timestamp format" },
        { status: 400 }
      );
    }

    const toDate = new Date(timestamp * 1000);
    const fromDate = new Date(timestamp * 1000 - 3600 * 1000); 

    // Step 1: Get fk_vessel and fk_vessel_data from MLAlarm
    const [alarm] = await prisma.$queryRawUnsafe<any[]>(
      `SELECT fk_vessel, fk_vessel_data FROM "MLAlarm" WHERE id = $1`,
      parseInt(alarmId)
    );

    if (!alarm || !alarm.fk_vessel) {
      console.log(`No alarm found for id=${alarmId} or fk_vessel missing`);
      return NextResponse.json(
        { success: false, message: "MLAlarm not found or fk_vessel missing" },
        { status: 404 }
      );
    }

    // Step 2: Get vessel data in the time range
    const vesselDataList = await prisma.$queryRawUnsafe<any[]>(
      `
      SELECT id, payload, "vesselTimeStamp"
      FROM "VesselData"
      WHERE fk_vessel = $1
        AND "vesselTimeStamp" >= $2
        AND "vesselTimeStamp" <= $3
      ORDER BY "vesselTimeStamp" ASC
      `,
      alarm.fk_vessel,
      Math.floor(fromDate.getTime() / 1000),
      Math.floor(toDate.getTime() / 1000)
    );

    // Log vesselDataList details
    vesselDataList.forEach((record, index) => {
      console.log(`Record ${index}: id=${record.id}, vesselTimeStamp=${record.vesselTimeStamp}, payload type=${typeof record.payload}`);
    });

    // Step 3: Extract tag values with robust payload handling
    const values = vesselDataList
      .filter((record) => {
        try {
          // Handle payload as string or object
          let payload = record.payload;
          if (typeof payload === "string") {
            payload = JSON.parse(payload);
          }
          if (payload && typeof payload === "object" && tag in payload) {
            return true;
          }
          console.log(`Record ${record.id} filtered out: tag "${tag}" not found or invalid payload`);
          return false;
        } catch (e) {
          console.error(`Error parsing payload for record ${record.id}:`, e);
          return false;
        }
      })
      .map((record) => {
        const payload = typeof record.payload === "string" ? JSON.parse(record.payload) : record.payload;
        const rawTime = payload["time"];
        return {
          id: record.id,
          value: payload[tag],
          payload_time: rawTime ? new Date(rawTime * 1000).toISOString() : null,
        };
      });

    // Log filtered values

    // Step 4: Check alarms (only 0 or 1)
    const alarms = values.every((item) => item.value === 0 || item.value === 1);

    // Step 5: Get current_value
    let current_value: any = null;
    if (alarm.fk_vessel_data) {
      const [currentData] = await prisma.$queryRawUnsafe<any[]>(
        `SELECT payload FROM "VesselData" WHERE id = $1`,
        alarm.fk_vessel_data
      );

      if (currentData?.payload) {
        const payload = typeof currentData.payload === "string" ? JSON.parse(currentData.payload) : currentData.payload;
        if (tag in payload) {
          const rawTime = payload["time"];
          current_value = {
            value: payload[tag],
            payload_time: rawTime ? new Date(rawTime * 1000).toISOString() : null,
          };
        } else {
          console.log(`Tag "${tag}" not found in currentData payload for fk_vessel_data=${alarm.fk_vessel_data}`);
        }
      } else {
        console.log(`No currentData found for fk_vessel_data=${alarm.fk_vessel_data}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        current_value,
        chart: values,
        alarms,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in tag-value API:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}