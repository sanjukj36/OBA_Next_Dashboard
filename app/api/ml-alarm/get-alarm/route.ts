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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing 'id' parameter" },
        { status: 400 }
      );
    }

    const mlAlarm = await prisma.mLAlarm.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        // vessel: true,
        vesseldata: true
      }
    });

    if (!mlAlarm) {
      return NextResponse.json(
        { success: false, message: "MLAlarm not found" },
        { status: 404 }
      );
    }

    const { payload } = mlAlarm?.vesseldata ?? {};
    let readableTime: string | null = null;

    if (payload?.time) {
      // Convert Unix timestamp to readable UTC string
      readableTime = new Date(payload.time * 1000).toISOString();
    }

    // Remove full payload from response
    if (mlAlarm?.vesseldata?.payload) {
      delete mlAlarm.vesseldata.payload;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...mlAlarm,
        time_utc: readableTime
      }
    });
  } catch (error: any) {
    console.error("Error fetching MLAlarm:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
