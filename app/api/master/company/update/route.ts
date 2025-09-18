import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

interface CompanyMaster {
  name: string;
  email: string;
}

/**
 * @swagger
 * /api/master/company/update:
 *   post:
 *     summary: Update a company
 *     tags:
 *       - api/master/company
 *     description: Updates an existing company based on the provided ID.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID of the company to update
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
 *               email:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing ID in query params
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */

export async function PUT(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required in query params" },
        { status: 400 }
      );
    }

    const body: CompanyMaster = await req.json();
    const name = body.name;
    const email = body.email;

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

      const updatedCompany = await prisma.company.update({
        where: { id },
        data: {
          name: name ?? existingCompany.name,
          email: email ?? existingCompany.email
        }
      });
      return NextResponse.json(
        { success: true, data: updatedCompany },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
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
