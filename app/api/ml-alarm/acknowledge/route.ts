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
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { success: false, message: "Missing alert id in query params" },
        { status: 400 }
      );
    }

    const alertId = parseInt(idParam, 10);
    if (isNaN(alertId)) {
      return NextResponse.json(
        { success: false, message: "Invalid alert id" },
        { status: 400 }
      );
    }

    const updatedAlert = await prisma.mLAlarm.update({
      where: { id: alertId },
      data: { isAcknowledged: true }
    });

    return NextResponse.json({
      success: true,
      message: "Alert acknowledged successfully"
      //   data: updatedAlert
    });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
