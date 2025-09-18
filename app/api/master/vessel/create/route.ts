// import { Power } from "lucide-react";
import { Prisma } from "@prisma/client"; // Import Prisma error codes
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/master/vessel/create:
 *   post:
 *     summary: Create a new vessel
 *     tags:
 *       - api/master/vessel
 *     description: Adds a new vessel to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Titanic"
 *               vessel_type:
 *                 type: string
 *                 example: "Cargo"
 *               imo:
 *                 type: string
 *                 example: "1234567"
 *               hull_no:
 *                 type: string
 *                 example: "HULL123"
 *               year_built:
 *                 type: string
 *                 example: "2020"
 *               cargo_capacity:
 *                 type: string
 *                 example: "50000"
 *               build_yard:
 *                 type: string
 *                 example: "XYZ Shipyard"
 *               country:
 *                 type: string
 *                 example: "USA"
 *               mcr:
 *                 type: string
 *                 example: "10000"
 *               model:
 *                 type: string
 *                 example: "XYZ-Model"
 *     responses:
 *       200:
 *         description: Vessel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult.isSuperuser;

    if (auth_usertype) {
      const body = await req.json();
      const {
        name,
        imo,
        email,
        vessel_type,
        hull_no,
        flag,
        port_of_regd,
        year_built,
        no_of_dg,
        vessel_class,
        dg_capacity_indvidual,
        dg_maker,
        dg_model,
        me_maker,
        me_model,
        power,
        mcr,
        geared_or_gearless,
        fk_company,
        fk_fleet
      } = body;

      const requiredFields = {
        name,
        imo,
        email,
        vessel_type,
        hull_no,
        flag,
        port_of_regd,
        year_built,
        no_of_dg,
        vessel_class,
        dg_capacity_indvidual,
        dg_maker,
        dg_model,
        me_maker,
        me_model,
        power,
        mcr,
        geared_or_gearless,
        fk_company,
        fk_fleet
      };

      const missingFields = Object.entries(requiredFields)
        .filter(
          ([value]) =>
            value === undefined || value === null || value === ""
        )
        .map(([key]) => key);

      if (missingFields.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing required fields",
            missing: missingFields
          },
          { status: 400 }
        );
      }

      try {
        const vessel = await prisma.vessel.create({
          data: {
            name,
            imo,
            email,
            vessel_type,
            hull_no,
            flag,
            port_of_regd,
            year_built: parseInt(year_built), // ✅ converted to int
            no_of_dg,
            vessel_class,
            dg_capacity_indvidual,
            dg_maker,
            dg_model,
            me_maker,
            me_model,
            power,
            mcr,
            geared_or_gearless,
            fk_company,
            fk_fleet
          }
        });

        return NextResponse.json(
          { success: true, data: { id: vessel.id, name: vessel.name } },
          { status: 200 }
        );
      } catch (error: any) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return NextResponse.json(
            { success: false, message: "Vessel name already exists" },
            { status: 400 }
          );
        }

        console.error("Database error:", error);
        return NextResponse.json(
          { success: false, message: "Internal server error" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
