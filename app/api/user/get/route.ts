import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
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
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return NextResponse.json(
          { success: false, message: "Fleet not found" },
          { status: 404 }
        );
      }

      interface existingUserType {
        name: string;
        email: string;
        usertype: number;
        isSuperuser: boolean;
        password: string;
        expiry: string;
        profilePicture: string;
      }

      const existingUserData: existingUserType = {
        name: existingUser.name ?? "",
        email: existingUser.email ?? "",
        usertype: existingUser.userTypeId ?? 0,
        isSuperuser: existingUser.isSuperuser ?? false,
        password: existingUser.password ?? "",
        profilePicture: existingUser.profilePicture ?? "",
        expiry: existingUser.expiry
          ? existingUser.expiry.toISOString().split("T")[0]
          : ""
      };

      return NextResponse.json(
        { success: true, data: existingUserData },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
