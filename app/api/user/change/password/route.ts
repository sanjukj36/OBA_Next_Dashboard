import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const id = authResult.id;

    const body = await req.json();
    const email = body.email;
    const current_password = body.current_password;
    const new_password = body.new_password;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, data: "No user found" },
        { status: 500 }
      );
    }

    const hashedPassword = existingUser.password;

    try {
      const match: boolean = await bcrypt.compare(
        current_password,
        hashedPassword
      );
      if (match) {
        const newhashedPassword = await bcrypt.hash(new_password, 10);
        await prisma.user.update({
          where: { id },
          data: {
            password: newhashedPassword
          }
        });
        return NextResponse.json(
          { success: true, data: null },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { success: false, data: "Invalid Password" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { success: false, data: "Error comparing passwords" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST /users/:id/password", error);
    return NextResponse.json(
      { success: false, data: "Error in POST /users/:id/password" },
      { status: 500 }
    );
  }
}
