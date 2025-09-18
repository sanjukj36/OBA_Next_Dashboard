import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse) return authResult;
  if (!authResult) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      name,
      description,
      priority,
      alert_send,
      fence_type,
      coords_array,
      fk_vessel
    } = body;

    if (!Array.isArray(coords_array)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input: coords_array must be an array"
        },
        { status: 400 }
      );
    }

    if (!fk_vessel) {
      return NextResponse.json(
        { success: false, message: "Missing fk_vessel" },
        { status: 400 }
      );
    }

    // Step 1: Check if vessel exists
    const vessel = await prisma.vessel.findUnique({
      where: { id: fk_vessel }
    });

    if (!vessel) {
      return NextResponse.json(
        { success: false, message: "Vessel not found" },
        { status: 404 }
      );
    }
    const created = await prisma.geofence.create({
      data: {
        name,
        description,
        priority,
        alert_send,
        fence_type,
        coordsArray: coords_array,
        fk_vessel
      }
    });

    return NextResponse.json({
      success: true,
      message: "Geofence polygon created for vessel"
      // data: created
    });
  } catch (error) {
    console.error("Geofence save error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
