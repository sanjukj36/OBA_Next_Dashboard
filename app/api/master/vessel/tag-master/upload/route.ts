import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

// ✅ Force Node.js runtime to allow file uploads
export const runtime = "nodejs";

/**
 * @swagger
 * /api/master/vessel/tag-master/upload:
 *   post:
 *     summary: Upload Excel file and insert/update tagMaster data
 *     tags:
 *       - api/master/tag
 *     description: Uploads an Excel file, parses its contents, and stores it in the tagMaster table. If tag data already exists for the given vessel_id, it will be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               vessel_id:
 *                 type: string
 *                 example: "101"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Tag data inserted or updated successfully
 *       400:
 *         description: Missing vessel ID, file, or invalid Excel sheet
 *       403:
 *         description: Unauthorized (not a superuser)
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    if (!authResult.isSuperuser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const vessel_id_raw = formData.get("vessel_id");
    const file = formData.get("file");

    // ✅ Validate vessel_id
    if (
      !vessel_id_raw ||
      typeof vessel_id_raw !== "string" ||
      isNaN(Number(vessel_id_raw))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid vessel_id" },
        { status: 400 }
      );
    }

    const vessel_id = Number(vessel_id_raw);

    // ✅ Validate file
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "No valid file uploaded" },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return NextResponse.json(
        { success: false, message: "Excel sheet is empty or unreadable" },
        { status: 400 }
      );
    }

    // // ✅ Check if tagMaster already exists for this vessel
    // const existingEntry = await prisma.tagMaster.findFirst({
    //   where: { fk_vessel: vessel_id }
    // });

    // if (existingEntry) {
    //   // ✅ Update existing
    //   await prisma.tagMaster.update({
    //     where: { id: existingEntry.id },
    //     data: { tag_data: jsonData }
    //   });
    // } else {
    //   // ✅ Create new
    //   await prisma.tagMaster.create({
    //     data: {
    //       tag_data: jsonData,
    //       fk_vessel: vessel_id
    //     }
    //   });
    // }

    jsonData.forEach((row) => {
      if (typeof row.description === "string") {
        row.description = row.description.trimEnd();
      }
    });

    return NextResponse.json(
      {
        success: true,
        vessel_id,
        sheetName,
        data: jsonData,
        rows: jsonData.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing Excel:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}
