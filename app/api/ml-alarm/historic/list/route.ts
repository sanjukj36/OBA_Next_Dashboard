import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

// Convert DD-MM-YYYY → JS Date
function parseDDMMYYYYtoDate(dateStr: string): Date | null {
  const [day, month, year] = dateStr.split("-").map(Number);
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
}

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
    const from_date = searchParams.get("from_date");
    const to_date = searchParams.get("to_date");
    const fk_vessel_id = searchParams.get("id");
    // const sortParam = searchParams.get("sort")?.toLowerCase(); // "asc" or "desc"
    const sortOrder = "desc";

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    if (!from_date || !to_date || !fk_vessel_id) {
      return NextResponse.json(
        {
          success: false,
          message: "from_date, to_date, and fk_vessel_id are required"
        },
        { status: 400 }
      );
    }

    const fromDate = parseDDMMYYYYtoDate(from_date);
    const toDate = parseDDMMYYYYtoDate(to_date);
    if (!fromDate || !toDate) {
      return NextResponse.json(
        { success: false, message: "Invalid date format. Use DD-MM-YYYY." },
        { status: 400 }
      );
    }
    toDate.setHours(23, 59, 59, 999);

    const alarms = await prisma.mLAlarm.findMany({
      where: {
        fk_vessel: parseInt(fk_vessel_id, 10),
        isAcknowledged: true
      },
      orderBy: {
        created_at: "desc"
      },
      select: {
        id: true,
        alarm_name: true,
        MlResponse: true,
        vesseldata: {
          select: {
            payload: true
          }
        }
      }
    });

    const allSorted = alarms
      .map(alarm => {
        const rawGmtTime = alarm.vesseldata?.payload?.time ?? null;
        const gmt_time = rawGmtTime
          ? new Date(rawGmtTime * 1000).toISOString()
          : null;

        return {
          id: alarm.id,
          alarm_name: alarm.alarm_name,
          MlResponse: alarm.MlResponse,
          gmt_time,
          rawGmtTime
        };
      })
      .filter(item => item.gmt_time !== null)
      .sort((a, b) => {
        return b.rawGmtTime - a.rawGmtTime;
      });

    const paginated = allSorted.slice(skip, skip + limit);

    const responseData = paginated.map(
      ({ id, alarm_name, MlResponse, gmt_time }) => ({
        id,
        alarm_name,
        MlResponse,
        vessel_time: gmt_time
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        meta: {
          page,
          limit,
          totalPages: Math.ceil(allSorted.length / limit),
          totalCount: allSorted.length
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sorted ML alarms:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
