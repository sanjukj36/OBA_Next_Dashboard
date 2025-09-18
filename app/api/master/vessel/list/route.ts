import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult;

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

    const is_superuser = auth_usertype.isSuperuser;
    const id = auth_usertype.userTypeId;

    let whereCondition: any = {};

    // Apply filters only for non-superusers
    if (!is_superuser) {
      whereCondition.is_deleted = false;

      if (search) {
        whereCondition.name = {
          contains: search,
          mode: "insensitive",
        };
      }

      const userType = await prisma.UserTypePriv.findFirst({ where: { id } });

      if (userType?.fk_company) {
        whereCondition.fk_company = userType.fk_company;
      } else if (userType?.fk_fleet) {
        whereCondition.fk_fleet = userType.fk_fleet;
      } else if (userType?.fk_vessel) {
        whereCondition.id = userType.fk_vessel;
      }
    } else {
      // For superusers, apply search only if present
      if (search) {
        whereCondition.name = {
          contains: search,
          mode: "insensitive",
        };
      }
    }

    const totalCount = await prisma.vessel.count({
      where: whereCondition,
    });

    const vessels = await prisma.vessel.findMany({
      where: whereCondition,
      include: {
        user_owner: {
          select: {
            id: true,
            email: true,
          },
        },
        company: {
          select: {
            name: true,
          },
        },
        fleet: {
          select: {
            name: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: vessels,
        meta: {
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
