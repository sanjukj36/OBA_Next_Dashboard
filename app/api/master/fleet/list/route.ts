import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult.isSuperuser;
    if (!auth_usertype) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Extract pagination and search query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    // Build where condition with optional search
    const whereCondition = {
      is_deleted: false,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive" as const
        }
      })
    };

    // Total count for pagination
    const totalCount = await prisma.fleet.count({
      where: whereCondition
    });

    // Fetch paginated and optionally filtered fleets
    const fleets = await prisma.fleet.findMany({
      where: whereCondition,
      include: {
        user_owner: {
          select: {
            id: true,
            email: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: fleets,
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
