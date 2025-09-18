import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult.isSuperuser;

    if (auth_usertype) {
      const body: any = await req.json();
      const id = body.id;

      if (!id) {
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
      if (existingUser.isActive == true) {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            isActive: false
          }
        });
      } else if (existingUser.isActive == false) {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            isActive: true
          }
        });
      }

      return NextResponse.json({ success: true, data: null }, { status: 200 });
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
