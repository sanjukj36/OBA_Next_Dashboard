import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const label = searchParams.get("label");
    const fk_vessel = searchParams.get("fk_vessel");

    if (!label || !fk_vessel) {
      return NextResponse.json(
        { success: false, message: "Missing label or fk_vessel" },
        { status: 400 }
      );
    }

    const vesselId = parseInt(fk_vessel);
    if (isNaN(vesselId)) {
      return NextResponse.json(
        { success: false, message: "Invalid fk_vessel" },
        { status: 400 }
      );
    }

    const record = await prisma.tagMasterManual.findFirst({
      where: {
        fk_vessel: vesselId,
        label: label
      }
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: record.tag_data
    });
  } catch (error) {
    console.error("GET /api/tag-master error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
