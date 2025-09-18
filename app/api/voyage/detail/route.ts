import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Auth
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // 🌐 Get query param
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const id = idParam ? parseInt(idParam) : null;

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Valid ID is required in query params" },
        { status: 400 }
      );
    }

    // ✅ Tags to extract
    const allowedTagsMap: Record<string, string> = {
      "V_GPSLAT_act_deg@LAST": "LAT",
      "V_GPSLON_act_deg@LAST": "LONG",
      "V_HDG_act_deg@AVG": "HDG"
    };

    // 🚀 Optimized raw query for latest payload
    const [latestData] = await prisma.$queryRaw<
      Array<{
        payload: any;
        createdAt: Date;
      }>
    >`
      SELECT payload, "createdAt"
      FROM "VesselData"
      WHERE "fk_vessel" = ${id}
      ORDER BY "createdAt" DESC
      LIMIT 1;
    `;

    if (!latestData || !latestData.payload) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }

    const parsedPayload =
      typeof latestData.payload === "string"
        ? JSON.parse(latestData.payload)
        : latestData.payload;

    // 🚢 Vessel metadata
    const vessel = await prisma.vessel.findUnique({
      where: { id: id },
      select: {
        id: true,
        imo: true,
        name: true,
        flag: true,
        vessel_type: true,
        company: { select: { name: true } },
        fleet: { select: { name: true } }
      }
    });

    if (!vessel) {
      return NextResponse.json(
        { success: false, message: "Vessel not found" },
        { status: 404 }
      );
    }

    // 🕒 Time info (Updated logic using payload.time)
    const currentUtc = Math.floor(Date.now() / 1000);
    let payloadTimeUnix = null;
    let readableUTC = null;
    let timeDifference = null;

    if (parsedPayload?.time && !isNaN(parsedPayload.time)) {
      payloadTimeUnix = parsedPayload.time;
      readableUTC = new Date(parsedPayload.time * 1000)
        .toISOString()
        .replace("T", " ")
        .replace("Z", "");
      timeDifference = currentUtc - parsedPayload.time;
    } else {
      // Fallback to createdAt if payload.time is not valid
      const fallbackDate = new Date(latestData.createdAt);
      payloadTimeUnix = Math.floor(fallbackDate.getTime() / 1000);
      readableUTC = fallbackDate
        .toISOString()
        .replace("T", " ")
        .replace("Z", "");
      timeDifference = currentUtc - payloadTimeUnix;
    }

    // 📊 Extract tag values
    const tagData: Record<string, number | null> = {};
    for (const rawTag in allowedTagsMap) {
      let value = parsedPayload[rawTag];
      if (typeof value === "number" && !Number.isInteger(value)) {
        value = Number.parseFloat(value.toFixed(2));
      }
      tagData[allowedTagsMap[rawTag]] = value !== undefined ? value : null;
    }

    // ✅ Final response
    return NextResponse.json(
      {
        success: true,
        data: {
          vessel_id: vessel.id,
          imo: vessel.imo,
          vessel_name: vessel.name,
          flag: vessel.flag,
          vessel_type: vessel.vessel_type,
          company: vessel.company?.name || null,
          fleet: vessel.fleet?.name || null,
          from: "NL MSV",
          to: "MY TPP",
          ATD: "2025-07-14 17:50",
          ReportedETA: "2025-08-16 06:30",
          data: tagData,
          time_info: {
            payload_time: payloadTimeUnix,
            readable_utc: readableUTC,
            time_difference_seconds: timeDifference
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /vesselData?id= error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
