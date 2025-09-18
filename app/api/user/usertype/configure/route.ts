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

interface Privtype {
  name: string;
  pages: string[];
  entity_type: string;
  fk_vessel?: string;
  fk_company?: string;
  fk_fleet?: string;
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    // const fk_created_by = authResult.id;
    // const auth_usertype = authResult.usertype;

    const body: Privtype = await req.json();

    const name = body.name;
    const pages = body.pages;
    const entity_type = body.entity_type;
    const fk_vessel = body.fk_vessel
    const fk_fleet = body.fk_fleet
    const fk_company = body.fk_company

    // entity_type = {"admin":"Admin",
    // "fleet_director":"Fleet Director",
    // "owner":"Owner",
    // "fleet_manager":"Fleet Manager",
    // "technical_supd":"Technical Superintendent",
    // "marine_supd":"Marine Superintendent",
    // "performance_analyst":"Performance Analyst",
    // "developer":"Developer",
    // "support":"Support"
    // }

    try {
      if(entity_type == "admin"){
        const userPriv = await prisma.userTypePriv.create({
          data: {
            name,
            pages,
            entity_type
          }
        });
      }
      else if(entity_type == "vessel"){
        const userPriv = await prisma.userTypePriv.create({
          data: {
            name,
            pages,
            entity_type,
            fk_vessel:parseInt(fk_vessel)
          }
        });
      }

      else if(entity_type == "fleet"){
        const userPriv = await prisma.userTypePriv.create({
          data: {
            name,
            pages,
            entity_type,
            fk_fleet:parseInt(fk_fleet)
          }
        });
      }

      else if(entity_type == "company"){
        const userPriv = await prisma.userTypePriv.create({
          data: {
            name,
            pages,
            entity_type,
            fk_company:parseInt(fk_company)
          }
        });
      }
      
      
      return NextResponse.json(
        { success: true, data: null },
        { status: 200 }
      );

    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Usertype already exists!", data: null },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const pages = {
      dashboard: "Dashboard",
      overview: "Overview"
    };

    return NextResponse.json({ success: true, data: pages }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, data: null }, { status: 500 });
  }
}
