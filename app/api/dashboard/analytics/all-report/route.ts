import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";
import ExcelJS from "exceljs";

interface DataPoint {
  time: Date;
  [key: string]: number | Date | undefined;
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

export async function POST(req: NextRequest) {
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
    const idParam = searchParams.get("id");
    const from_date = searchParams.get("from_date");
    const to_date = searchParams.get("to_date");

    const id = idParam ? parseInt(idParam) : null;
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "Valid ID is required" },
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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Vessel Data");

    // 🔍 Step 1: Collect all tag keys from payloads
    const tagsSet = new Set<string>();
    for (const record of records) {
      const payload = record.payload || {};
      Object.keys(payload).forEach((key) => tagsSet.add(key));
    }
    const tagKeys = Array.from(tagsSet).sort(); // Sorted for consistency

    // 🧾 Step 2: Prepare header
    const headers = ["Time", ...tagKeys];
    worksheet.addRow(headers);

    // 🧮 Step 3: Process and append rows
    for (const record of records) {
      const payload = record.payload || {};
      const row: any[] = [
        new Date(record.vesselTime).toISOString().replace("T", " ").substring(0, 19)
      ];

      for (const key of tagKeys) {
        const rawValue = formatValue(payload[key]);
        row.push(rawValue ?? 0); // replace null with 0
      }

      worksheet.addRow(row);
    }

    // 📦 Step 4: Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const vessel = await prisma.vessel.findUnique({
        where: { id: parseInt(idParam) },
      });
    const vesselname = vessel.name
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${vesselname}_${fromDateStr}_to_${toDateStr}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("POST /vesselData error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
