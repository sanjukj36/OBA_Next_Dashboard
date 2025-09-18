import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

interface TagMaster {
  vessel_id: number;
  tag_master: Array<Record<string, any>>;
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult.isSuperuser;
    if (auth_usertype) {
      const body: TagMaster = await req.json();
      const vessel_id = body.vessel_id;
      const tag_master = body.tag_master;

      if (!vessel_id || !tag_master) {
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }

      try {
        const tag_master_query = await prisma.tagMaster.upsert({
          where: {
            fk_vessel: vessel_id
          },
          update: {
            tag_data: tag_master
          },
          create: {
            fk_vessel: vessel_id,
            tag_data: tag_master
          }
        });

        return NextResponse.json(
          { success: true, data: null },
          { status: 200 }
        );
      } catch (error) {
        console.log(error);
        return NextResponse.json(
          { success: false, message: "Internal server error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
