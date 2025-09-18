import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
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
    const Id = searchParams.get("id");

    if (!Id) {
      return NextResponse.json(
        { success: false, message: "Missing 'id' in query params" },
        { status: 400 }
      );
    }

    const id = parseInt(Id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "'fk_vessel_id' must be a valid integer" },
        { status: 400 }
      );
    }

    const polygon = await prisma.geofence.findFirst({
      where: { id }
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

    await prisma.geofence.delete({
      where: { id: polygon.id }
    });

    return NextResponse.json({
      success: true,
      message: `Geofence deleted successfully`
    });
  } catch (error) {
    console.error("Geofence DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
