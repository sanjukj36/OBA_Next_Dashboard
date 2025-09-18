import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

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
    const fk_vessel_id = searchParams.get("id");

    const fenceList = await prisma.geofence.findMany({
      where: {
        fk_vessel: parseInt(fk_vessel_id, 10)
      },
      select: {
        id: true,
        name: true,
        description: true,
        priority: true,
        isActive: true,
        fence_type: true,
        coordsArray: true
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: fenceList
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
