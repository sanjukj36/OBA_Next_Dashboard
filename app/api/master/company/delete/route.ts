import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/master/company/delete:
 *   delete:
 *     summary: Soft delete a company by ID
 *     tags:
 *       - api/master/company
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company to be deleted
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       400:
 *         description: ID is required in query params
 *       404:
 *         description: Company not found
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
      const existingCompany = await prisma.company.findUnique({
        where: { id }
      });

      if (!existingCompany) {
        return NextResponse.json(
          { success: false, message: "Company not found" },
          { status: 404 }
        );
      }

      const deletedCompany = await prisma.company.delete({
        where: { id }
      });

      return NextResponse.json(
        { success: true, data: deletedCompany },
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
