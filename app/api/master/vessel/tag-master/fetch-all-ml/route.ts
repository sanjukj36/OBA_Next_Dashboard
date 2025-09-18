import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // const authResult = await authMiddleware(req);
    // if (authResult instanceof NextResponse) return authResult;
    // if (!authResult) {
    //   return NextResponse.json(
    //     { success: false, message: "Unauthorized" },
    //     { status: 403 }
    //   );
    // }

    const { searchParams } = new URL(req.url);
    const imo = searchParams.get("imo");
    const label = searchParams.get("label") || null;

    if (!imo) {
      return NextResponse.json(
        { success: false, message: "Valid IMO is required in query params" },
        { status: 400 }
      );
    }

    // Find vessel
    const vessel = await prisma.vessel.findFirst({
      where: { imo: imo }
    });

    if (!vessel) {
      return NextResponse.json(
        { success: false, message: "Vessel not found" },
        { status: 404 }
      );
    }

    // Get tagMaster
    const tagMasterQuery = await prisma.tagMaster.findFirst({
      where: { fk_vessel: vessel.id }
    });

    if (!tagMasterQuery || !tagMasterQuery.tag_data) {
      return NextResponse.json(
        { success: false, message: "No tag data found" },
        { status: 404 }
      );
    }

    const tag_data: any[] = tagMasterQuery.tag_data;

    // Get latest vessel data
    const vesselDataQuery = await prisma.vesselDataLive.findFirst({
      where: { fk_vessel: vessel.id },
      orderBy: { createdAt: "desc" }
    });

    if (!vesselDataQuery) {
      return NextResponse.json(
        { success: false, message: "No vessel live data found" },
        { status: 404 }
      );
    }

    // Build response array
    const dataArr = tag_data.map(item => {
      const tag_from_vessel = item.tag_from_vessel;
      const payload = vesselDataQuery.payload || {};
      const tag_value = payload[tag_from_vessel];

      return {
        value: tag_value,
        unit: item.unit,
        description: item.description,
        tag_from_vessel,
        response_type: item.response_type,
        datatype: item.datatype,
        minimum: item.minimum,
        maximum: item.maximum
      };
    });

    return NextResponse.json(
      { success: true, data: { label, data: dataArr } },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
