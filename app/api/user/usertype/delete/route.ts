import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
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

    try {
      const userPriv = await prisma.userTypePriv.findUnique({ where: { id } });

      if (!userPriv) {
        return NextResponse.json(
          { success: false, message: "User group not found" },
          { status: 404 }
        );
      }

      const deletedUserPriv = await prisma.userTypePriv.delete({
        where: { id }
      });

      return NextResponse.json(
        { success: true, data: deletedUserPriv },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error },
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
