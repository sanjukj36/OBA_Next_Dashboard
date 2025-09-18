import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

// import { rateLimiter } from "@/app/middleware/rateLimiter";

interface DataPoint {
  time: Date;
  [key: string]: number | Date | undefined;
}

interface TagsWithFactors {
  [tagName: string]: string;
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

function applyFactor(value: number | null, factor: string): number | null {
  if (value === null) return null;
  
  const factorNum = parseFloat(factor);
  if (isNaN(factorNum)) return value;
  
  const result = value * factorNum;
  return Number.isInteger(result) ? result : parseFloat(result.toFixed(2));
}

export async function POST(req: NextRequest) {
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
    const from_date = searchParams.get("from_date");
    const to_date = searchParams.get("to_date");

    // Parse request body for tags with factors
    let tagsWithFactors: TagsWithFactors;
    try {
      tagsWithFactors = await req.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate ID parameter
    const id = idParam ? parseInt(idParam) : null;
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Valid ID is required" },
        { status: 400 }
      );
    }

    // Validate tags
    if (!tagsWithFactors || Object.keys(tagsWithFactors).length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one tag with factor is required in request body" },
        { status: 400 }
      );
    }

    // Validate date parameters
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

    // Query database
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

    // Process data with factors
    const dataArray: DataPoint[] = records.map(record => {
      const payload = record.payload || {};
      const dataPoint: DataPoint = {
        time: record.vesselTime
      };

      // Process each tag with its factor
      Object.entries(tagsWithFactors).forEach(([tagName, factor]) => {
        const rawValue = formatValue(payload[tagName]);
        const valueWithFactor = applyFactor(rawValue, factor);
        
        // Always include the tag in the response, even if null
        // This helps identify missing data vs missing tags
        dataPoint[tagName] = valueWithFactor;
      });

      return dataPoint;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          from_date: fromDateStr,
          to_date: toDateStr,
          data: dataArray,
          tags: tagsWithFactors
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /vesselData error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}