import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

function formatVesselTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
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
    const tagParam = searchParams.get("tag");
    const dateParam = searchParams.get("date");

    const id = idParam ? parseInt(idParam) : null;
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Valid ID is required in query params" },
        { status: 400 }
      );
    }

    let latestVesselData;

    if (dateParam) {
      latestVesselData = await prisma.vesselDataLive.findFirst({
        where: {
          fk_vessel: id,
          vesselTimeStamp: Number(dateParam)
        },
        orderBy: {
          vesselTime: "desc"
        }
      });
    }

    // fallback to latest if not found by date
    if (!latestVesselData) {
      latestVesselData = await prisma.vesselDataLive.findFirst({
        where: { fk_vessel: id },
        orderBy: { createdAt: "desc" }
      });
    }

    if (!latestVesselData || !latestVesselData.payload) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 400 }
      );
    }

    const parsedPayload =
      typeof latestVesselData.payload === "string"
        ? JSON.parse(latestVesselData.payload)
        : latestVesselData.payload;

    if (!tagParam || !parsedPayload.hasOwnProperty(tagParam)) {
      return NextResponse.json(
        { success: false, message: `Tag '${tagParam}' not found in payload` },
        { status: 400 }
      );
    }

    const existingTagMaster = await prisma.tagMaster.findUnique({
      where: { fk_vessel: id }
    });

    let tag_obj = null;

    if (
      existingTagMaster?.tag_data &&
      Array.isArray(existingTagMaster.tag_data)
    ) {
      for (const tag of existingTagMaster.tag_data) {
        if (tag.tag_from_vessel === tagParam) {
          tag_obj = {
            unit: tag.unit,
            description: tag.description || tag.unit,
            tag_from_vessel: tag.tag_from_vessel,
            min:
              typeof tag.min === "number" && !Number.isInteger(tag.min)
                ? Number.parseFloat(Number(tag.min).toFixed(2))
                : tag.min,
            max:
              typeof tag.max === "number" && !Number.isInteger(tag.max)
                ? Number.parseFloat(Number(tag.max).toFixed(2))
                : tag.max,
            datatype: tag.datatype
          };
          break;
        }
      }
    }

    let dataValue = parsedPayload[tagParam];
    if (typeof dataValue === "number" && !Number.isInteger(dataValue)) {
      dataValue = Number.parseFloat(Number(dataValue).toFixed(2));
    }

    const formattedVesselTime = latestVesselData.vesselTime
      ? formatVesselTime(new Date(latestVesselData.vesselTime))
      : null;

    return NextResponse.json(
      {
        success: true,
        data: {
          value: dataValue,
          vesselTime: dateParam,
          tag_obj
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /vesselData error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
