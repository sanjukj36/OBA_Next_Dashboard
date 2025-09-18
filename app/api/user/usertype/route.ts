import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";

// import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/master/vessel/list:
 *   get:
 *     summary: Retrieve all vessels
 *     tags:
 *       - api/master/vessel
 *     description: Fetch all non-deleted vessels. Only accessible by admin users.
 *     responses:
 *       200:
 *         description: List of vessels retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       vessel_type:
 *                         type: string
 *                       imo:
 *                         type: string
 *                       hull_no:
 *                         type: string
 *                       year_built:
 *                         type: string
 *                       cargo_capacity:
 *                         type: string
 *                       build_yard:
 *                         type: string
 *                       country:
 *                         type: string
 *                       mcr:
 *                         type: string
 *                       model:
 *                         type: string
 *                       user_owner:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *       403:
 *         description: Unauthorized - only admins can access.
 *       500:
 *         description: Internal server error.
 */

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult.usertype;

    if (auth_usertype == "admin") {
      const usertype = {
        admin: "Admin",
        fleet_director: "Fleet Director",
        owner: "Owner",
        fleet_manager: "Fleet Manager",
        technical_supd: "Technical Superintendent",
        marine_supd: "Marine Superintendent",
        performance_analyst: "Performance Analyst",
        developer: "Developer",
        support: "Support"
      };

      return NextResponse.json(
        { success: true, data: usertype },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ success: false, data: null }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
