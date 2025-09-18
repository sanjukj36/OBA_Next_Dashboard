import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vesselId, label, data } = body;

    if (!vesselId || !label || !Array.isArray(data)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const existing = await prisma.tagMasterManual.findFirst({
      where: {
        fk_vessel: vesselId,
        label: label
      }
    });

    if (!existing) {
      const created = await prisma.tagMasterManual.create({
        data: {
          fk_vessel: vesselId,
          label: label,
          tag_data: data
        }
      });

      return NextResponse.json({
        success: true,
        message: "Entry created",
        data: created
      });
    } else {
      const updated = await prisma.tagMasterManual.update({
        where: { id: existing.id },
        data: {
          tag_data: data
        }
      });

      return NextResponse.json({
        success: true,
        message: "Tag data updated",
        data: updated
      });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
