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

    // Build search filter
    const whereCondition: Prisma.UserWhereInput = {
      isDeleted: false,
      ...(search && {
        email: {
          contains: search,
          mode: Prisma.QueryMode.insensitive
        }
      })
    };

    // 1. Count total matching results
    const totalCount = await prisma.user.count({
      where: whereCondition
    });

    // 2. Fetch paginated matching results
    const userPrivlgs = await prisma.user.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        email: true,
        expiry: true,
        isActive: true,
        userType: {
          select: {
            name: true
          }
        }
      }
    });

    // Transform expiry to date-only string (e.g., "2025-10-03")
    const formattedUserPrivlgs = userPrivlgs.map(user => ({
      ...user,
      expiry: user.expiry ? user.expiry.toISOString().split("T")[0] : null
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedUserPrivlgs,
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
