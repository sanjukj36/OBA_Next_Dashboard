import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/master/fleet/update:
 *   put:
 *     summary: Update a fleet
 *     tags:
 *       - api/master/fleet
 *     description: Updates the name and/or email of an existing fleet.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of the fleet to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "UpdatedFleet"
 *               email:
 *                 type: string
 *                 example: "updatedfleet@example.com"
 *     responses:
 *       200:
 *         description: Fleet updated successfully
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
 *                     email:
 *                       type: string
 *       400:
 *         description: Missing ID in query params
 *       404:
 *         description: Fleet not found
 *       500:
 *         description: Internal server error
 */

interface FleetMaster {
  name: string;
  email: string;
  fleet_director: string;
  fleet_dir_email: string;
  no_of_vessels: number;
}

export async function PUT(req: NextRequest) {
  const authResult = await authMiddleware(req);
  if (authResult instanceof NextResponse) return authResult;
  const auth_usertype = authResult.isSuperuser;
  if (!auth_usertype) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 403 }
    );
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required in query params" },
        { status: 400 }
      );
    }

    const body: FleetMaster = await req.json();
    const name = body.name;
    const email = body.email;
    const fleet_director = body.fleet_director;
    const fleet_dir_email = body.fleet_dir_email;
    const no_of_vessels = body.no_of_vessels;

    try {
      const existingFleet = await prisma.fleet.findUnique({
        where: { id }
      });

      if (!existingFleet) {
        return NextResponse.json(
          { success: false, message: "Fleet not found" },
          { status: 404 }
        );
      }
      const updatedFleet = await prisma.fleet.update({
        where: { id },
        data: {
          name: name ?? existingFleet.name,
          email: email ?? existingFleet.email,
          fleet_director: fleet_director ?? existingFleet.fleet_director,
          fleet_dir_email: fleet_dir_email ?? existingFleet.fleet_dir_email,
          no_of_vessels: no_of_vessels ?? existingFleet.no_of_vessels
        }
      });
      return NextResponse.json(
        { success: true, data: updatedFleet },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
