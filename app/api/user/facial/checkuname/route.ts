import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface UserLogin {
  email: string;
}

export async function POST(req: Request) {
  try {
    const body: UserLogin = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Invalid username" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user?.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid user" },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid username" });
    }

    return NextResponse.json(
      {
        success: true,
        email: email
      },
      { status: 200 }
    );
  } catch (error) {}
}
