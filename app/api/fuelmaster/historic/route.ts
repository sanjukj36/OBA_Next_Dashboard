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
    const sortParam = searchParams.get("sort")?.toLowerCase();
    const sortOrder = sortParam === "asc" ? "asc" : "desc";

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

    // Count total records
    const totalRecords = await prisma.FuelMaster.count({
      where: {
        fk_vessel: parseInt(fk_vessel_id, 10),
        isAlert: true,
        vesselTime: {
          gte: fromDate,
          lte: toDate
        }
      }
    });

    // Fetch paginated results
    const alarms = await prisma.FuelMaster.findMany({
      where: {
        fk_vessel: parseInt(fk_vessel_id, 10),
        isAcknowledged:true,
        isAlert: true,
        vesselTime: {
          gte: fromDate,
          lte: toDate
        }
      },
      select: {
        id: true,
        payload: true,
        predictedValue: true,
        vesselTime: true
      },
      orderBy: {
        vesselTime: sortOrder
      },
      skip,
      take: limit
    });

    // Transform data to match requested output + add message
    const transformedData = alarms.map((alarm) => {
      const actualValue = alarm.payload?.["ME_FMS_act_kgPh@AVG"] ?? null;
      return {
        id: alarm.id,
        ["ME_FMS_act_kgPh@AVG"]: actualValue,
        predictedValue: alarm.predictedValue,
        vesselTime: alarm.vesselTime,
        message: `Expected Main Engine Fuel Consumption is "${alarm.predictedValue}" kgPh
        , Actual value from the Vessel is "${actualValue}" kgPh
        `
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: transformedData,
        pagination: {
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: page,
          limit
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
