import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/master/fleet/delete:
 *   delete:
 *     summary: Delete a fleet
 *     tags:
 *       - api/master/fleet
 *     description: Marks a fleet as deleted based on the provided ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of the fleet to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Fleet deleted successfully
 *       400:
 *         description: Missing ID in query params
 *       404:
 *         description: Fleet not found
 *       500:
 *         description: Internal server error
 */

export async function DELETE(req: NextRequest) {
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
    try {
      const existingFleet = await prisma.fleet.findUnique({ where: { id } });

      if (!existingFleet) {
        return NextResponse.json(
          { success: false, message: "User group not found" },
          { status: 404 }
        );
      }

      const deletedFleet = await prisma.fleet.delete({
        where: { id }
      });

      return NextResponse.json(
        { success: true, data: deletedFleet },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
