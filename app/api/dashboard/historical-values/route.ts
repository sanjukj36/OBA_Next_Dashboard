import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

// import { rateLimiter } from "@/app/middleware/rateLimiter";

interface DataPoint {
  time: Date;
  value1?: number;
  value2?: number;
  value3?: number;
  value4?: number;
}

function parseDateDDMMYYYYtoISO(dateStr: string): string | null {
  const [day, month, year] = dateStr.split("-").map(Number);
  if (!day || !month || !year) return null;

  const parsedDate = new Date(year, month - 1, day);
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return null;
  }

  const yyyy = parsedDate.getFullYear();
  const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const dd = String(parsedDate.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatValue(value: any): number | null {
  try {
    if (typeof value !== "number" || isNaN(value)) {
      return null;
    }
    return Number.isInteger(value) ? value : parseFloat(value.toFixed(2));
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // const rateLimitResponse = await rateLimiter(req);
    // if (rateLimitResponse) return rateLimitResponse;

    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const tag1 = searchParams.get("tag1");
    const tag2 = searchParams.get("tag2");
    const tag3 = searchParams.get("tag3");
    const tag4 = searchParams.get("tag4");
    const from_date = searchParams.get("from_date");
    const to_date = searchParams.get("to_date");

    const id = idParam ? parseInt(idParam) : null;
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Valid ID is required" },
        { status: 400 }
      );
    }

    if (!tag1 && !tag2 && !tag3 && !tag4) {
      return NextResponse.json(
        { success: false, message: "At least one tag parameter is required" },
        { status: 400 }
      );
    }

    const fromDateStr = from_date ? parseDateDDMMYYYYtoISO(from_date) : null;
    const toDateStr = to_date ? parseDateDDMMYYYYtoISO(to_date) : null;

    if (!fromDateStr || !toDateStr) {
      return NextResponse.json(
        { success: false, message: "Invalid date format. Use DD-MM-YYYY" },
        { status: 400 }
      );
    }

    const startDate = `${fromDateStr}T00:00:00Z`;
    const endDate = `${toDateStr}T23:59:59Z`;

    const rawQuery = `
      SELECT id, payload, "vesselTime"
      FROM "VesselData"
      WHERE "fk_vessel" = $1
        AND "vesselTime" BETWEEN $2::timestamptz AND $3::timestamptz
      ORDER BY "vesselTime" ASC;
    `;

    const records: any[] = await prisma.$queryRawUnsafe(
      rawQuery,
      id,
      startDate,
      endDate
    );

    const dataArray: DataPoint[] = records.map(record => {
      const payload = record.payload || {};
      return {
        time: record.vesselTime,
        value1: tag1 ? formatValue(payload[tag1]) : undefined,
        value2: tag2 ? formatValue(payload[tag2]) : undefined,
        value3: tag3 ? formatValue(payload[tag3]) : undefined,
        value4: tag4 ? formatValue(payload[tag4]) : undefined
      };
    });

    const tagObject: { [key: string]: string } = {};
    if (tag1) tagObject.tag1 = tag1;
    if (tag2) tagObject.tag2 = tag2;
    if (tag3) tagObject.tag3 = tag3;
    if (tag4) tagObject.tag4 = tag4;

    return NextResponse.json(
      {
        success: true,
        data: {
          from_date: fromDateStr,
          to_date: toDateStr,
          data: dataArray,
          tag: tagObject
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /vesselData error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
