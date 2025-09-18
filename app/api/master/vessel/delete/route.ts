import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/master/vessel/delete:
 *   delete:
 *     summary: Soft delete a vessel
 *     tags:
 *       - api/master/vessel
 *     description: Marks a vessel as deleted instead of removing it permanently.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vessel to delete.
 *     responses:
 *       200:
 *         description: Vessel marked as deleted successfully.
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
 *                     is_deleted:
 *                       type: boolean
 *       400:
 *         description: Missing or invalid vessel ID.
 *       404:
 *         description: Vessel not found.
 *       500:
 *         description: Internal server error.
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
      const existingVessel = await prisma.vessel.findUnique({ where: { id } });

      if (!existingVessel) {
        return NextResponse.json(
          { success: false, message: "User group not found" },
          { status: 404 }
        );
      }
      const deletedVessel = await prisma.vessel.delete({
        where: { id }
      });

      return NextResponse.json(
        { success: true, data: deletedVessel },
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
