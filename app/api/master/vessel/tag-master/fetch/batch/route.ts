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
    const fk_vessel = searchParams.get("fk_vessel");
    const label = searchParams.get("label");

    if (!fk_vessel || !label) {
      return NextResponse.json(
        { success: false, message: "Valid ID is required in query params" },
        { status: 400 }
      );
    }

    const tagMasterQuery = await prisma.tagMasterManual.findFirst({
      where: { fk_vessel: parseInt(fk_vessel), label: label }
    });

    if (!tagMasterQuery || !tagMasterQuery.tag_data) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 400 }
      );
    }

    const tag_data = tagMasterQuery.tag_data;
    const vesselDataQuery = await prisma.vesselDataLive.findFirst({
      where: { fk_vessel: parseInt(fk_vessel) },
      orderBy: { createdAt: "desc" }
    });
    if (!vesselDataQuery) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 400 }
      );
    }
    const dataArr: {
      value: any;
      unit: any;
      description: any;
      tag_from_vessel: any;
      minimum: any;
      maximum: any;
    }[] = [];

    tag_data.forEach(item => {
      let tag_from_vessel = item.tag_from_vessel;

      let payload = vesselDataQuery.payload;
      let tag_value = payload[tag_from_vessel];
      let tag_obj = {
        value: tag_value,
        unit: item.unit,
        description: item.description,
        tag_from_vessel: tag_from_vessel,
        response_type: item.response_type,
        datatype: item.datatype,
        minimum: item.minimum,
        maximum: item.maximum
      };
      dataArr.push(tag_obj);
    });

    return NextResponse.json(
      { success: true, data: { label: label, data: dataArr } },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERROR", error);
    return NextResponse.json({ success: false, data: error }, { status: 400 });
  }
}
