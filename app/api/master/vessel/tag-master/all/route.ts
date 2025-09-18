import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult;
    if (auth_usertype) {
      const fk_vessel = req.nextUrl.searchParams.get("fk_vessel");

      if (!fk_vessel) {
        return NextResponse.json(
          { error: "fk_vessel parameter is required" },
          { status: 400 }
        );
      }

      const tagMaster = await prisma.tagMaster.findUnique({
        where: {
          fk_vessel: parseInt(fk_vessel)
        },
        select: {
          tag_data: true
        }
      });

      if (!tagMaster) {
        return NextResponse.json(
          { error: "No data found for the provided fk_vessel" },
          { status: 404 }
        );
      }


      // Extract descriptions from tag_data
      const descriptions = Array.isArray(tagMaster.tag_data)
        ? tagMaster.tag_data.map((item: any) => item.tag_from_vessel)
        : [];

      return NextResponse.json({ success: true, data: descriptions });
    } else {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error fetching tag descriptions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
