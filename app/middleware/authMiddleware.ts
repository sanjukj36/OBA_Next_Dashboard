import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY ?? "";

interface DecodedType extends jwt.JwtPayload {
  usertype?: number | null;
  fk_company_entity?: number[] | null;
  fk_fleet_entity?: number[] | null;
  fk_vessel_entity?: number[] | null;
}

function verifyToken(token: string): DecodedType | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as DecodedType;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 403 }
    );
  }
  const email = decoded?.email;
  // console.log("EMAIL", email)
  const user = await prisma.user.findFirst({
    where: { email }
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }
  // console.log("USER", user)
  decoded.usertype = user?.userTypeId;
  decoded.isSuperuser = user?.isSuperuser;
  decoded.fk_company_entity = user?.fk_company_entity;
  decoded.fk_fleet_entity = user?.fk_fleet_entity;
  decoded.fk_vessel_entity = user?.fk_vessel_entity;
  decoded.userTypeId = user?.userTypeId
  // console.log("DECOXDED",decoded)

  return decoded; // Return the decoded token for further use
}
