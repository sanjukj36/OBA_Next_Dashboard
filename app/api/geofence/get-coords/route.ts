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
    const { searchParams } = new URL(req.url);
    const param_id = searchParams.get("id");

    if (!param_id) {
      return NextResponse.json(
        { success: false, message: "Missing 'fk_vessel_id' in query params" },
        { status: 400 }
      );
    }

    const id = parseInt(param_id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid 'id' (must be an integer)" },
        { status: 400 }
      );
    }

    const polygon = await prisma.geofence.findFirst({
      where: { id },
      include: {
        vessel: {
          select: { name: true }
        }
      }
    });

    if (!polygon) {
      return NextResponse.json(
        {
          success: false,
          message: "No geofence polygon found for this vessel"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: polygon.id,
        name: polygon.name,
        description: polygon.description,
        priority: polygon.priority,
        alert_send: polygon.alert_send,
        fence_type: polygon.fence_type,
        fk_vessel: polygon.fk_vessel,
        coordsArray: polygon.coordsArray,
        vesselName: polygon.vessel?.name || null,
        createdAt: polygon.createdAt
      }
    });
  } catch (error) {
    console.error("Geofence GET error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
