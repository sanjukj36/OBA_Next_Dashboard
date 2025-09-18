import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
}

interface UserLogin {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const body: UserLogin = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid user" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }

    let token: string;
    const token_expiry =
      (process.env.JWT_TOKEN_EXPIRY as Pick<
        jwt.SignOptions,
        "expiresIn"
      >["expiresIn"]) || "0.5h";

    if (user.isSuperuser) {
      token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          userType: user.userTypeId
        },
        JWT_SECRET_KEY,
        { expiresIn: "720h" }
      );
    } else {
      token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          userType: user.userTypeId
        },
        JWT_SECRET_KEY,
        { expiresIn: token_expiry }
      );
    }

    return NextResponse.json(
      {
        success: true,
        token,
        is_superuser: user.isSuperuser,
        email: user.email,
        userType: user.userTypeId,
        company_entity: user.fk_company_entity,
        fleet_entity: user.fk_fleet_entity,
        vessel_entity: user.fk_vessel_entity
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
