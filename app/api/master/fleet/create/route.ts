import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

interface FleetMaster {
  name: string;
  email: string;
  fleet_director: string;
  fleet_dir_email: string;
  no_of_vessels: number;
}

/**
 * @swagger
 * /api/master/fleet/create:
 *   post:
 *     summary: Create a new fleet
 *     tags:
 *        - api/master/fleet
 *     description: Adds a new fleet to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "FleetOne"
 *               email:
 *                 type: string
 *                 example: "fleetone@example.com"
 *     responses:
 *       200:
 *         description: Fleet created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult.isSuperuser;

    if (auth_usertype) {
      const body: FleetMaster = await req.json();
      const name = body.name;
      const email = body.email;
      const fleet_director = body.fleet_director;
      const fleet_dir_email = body.fleet_dir_email;
      const no_of_vessels = body.no_of_vessels;

      if (!name || !email) {
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }

      try {
        const fleetmaster = await prisma.fleet.create({
          data: {
            name: name,
            email: email,
            fleet_director: fleet_director,
            fleet_dir_email: fleet_dir_email,
            no_of_vessels: no_of_vessels
          }
        });
        return NextResponse.json(
          { success: true, data: fleetmaster },
          { status: 200 }
        );
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (error.code === "P2002") {
            return NextResponse.json(
              {
                success: false,
                message: "There is a unique constraint violation"
              },
              { status: 500 }
            );
          }
        }
        throw error;
      }
    } else {
      return NextResponse.json({ success: false, data: null }, { status: 403 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
