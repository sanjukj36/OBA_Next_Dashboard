import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

interface Privtype {
  name: string;
  pages: string[];
  entity_type: string;
  fk_vessel?: string;
  fk_company?: string;
  fk_fleet?:string;
}

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

    const body: Privtype = await req.json();
    const name = body.name;
    const pages = body.pages;
    const entity_type = body.entity_type;
    const fk_company = body.fk_company;
    const fk_fleet = body.fk_fleet

    try {
      if(entity_type == "admin"){
        const userPriv = await prisma.userTypePriv.update({
          where: { id },
          data: {
            name,
            pages,
            entity_type
          }
        });
      }
      else if(entity_type == "vessel"){
        const userPriv = await prisma.userTypePriv.update({
          where: { id },
          data: {
            name,
            pages,
            entity_type,
            fk_vessel:parseInt(fk_vessel)
          }
        });
      }
      else if(entity_type == "company"){
        const userPriv = await prisma.userTypePriv.update({
          where: { id },
          data: {
            name,
            pages,
            entity_type,
            fk_company:parseInt(fk_company)
          }
        });
      }
      else if(entity_type == "fleet"){
        const userPriv = await prisma.userTypePriv.update({
          where: { id },
          data: {
            name,
            pages,
            entity_type,
            fk_fleet:parseInt(fk_fleet)
          }
        });
      }
      
      return NextResponse.json(
        { success: true, data: null },
        { status: 200 }
      );
      
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error, data: null },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error, data: null },
      { status: 500 }
    );
  }
}
