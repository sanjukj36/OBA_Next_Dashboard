import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/master/company/create:
 *   post:
 *     summary: Create a new company
 *     tags:
 *       - api/master/company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "TechCorp"
 *               email:
 *                 type: string
 *                 example: "contact@techcorp.com"
 *               country:
 *                 type: string
 *                 example: "USA"
 *     responses:
 *       200:
 *         description: Company created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 */

interface Company {
  name: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const fk_created_by = authResult.id;
    const auth_usertype = authResult.isSuperuser;

    if (auth_usertype) {
      const body: Company = await req.json();

      const name = body.name;
      const email = body.email;

      await prisma.company.create({
        data: {
          name: name,
          email: email,
          fk_created_by: fk_created_by
        }
      });
      return NextResponse.json({ success: true, data: null }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, data: null }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
