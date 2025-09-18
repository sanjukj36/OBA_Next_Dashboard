import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    // First build full search filter
    const whereCondition: Prisma.UserTypePrivWhereInput = {
      isDeleted: false,
      ...(search && {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive
        }
      })
    };

    // 1. First count how many total matching results
    const totalCount = await prisma.userTypePriv.count({
      where: whereCondition
    });

    // 2. Then fetch only paginated matching results
    const userPrivlgs = await prisma.userTypePriv.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        name: "asc" // optional: sort alphabetically
      },
      select: {
        id: true,
        name: true
        // add other fields you want to return
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: userPrivlgs,
        meta: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
