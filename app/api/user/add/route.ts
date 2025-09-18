import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";

const prisma = new PrismaClient();

interface UserData {
  name: string;
  email: string;
  password: string;
  userTypeId: number;
  expiry: Date | null;
  fk_company_entity?: number[];
  fk_fleet_entity?: number[];
  fk_vessel_entity?: number[];
  isActive?: boolean;
  profilePicture?: string;
}

export async function POST(req: NextRequest) {
  try {
    // const authResult = await authMiddleware(req);
    // if (authResult instanceof NextResponse) return authResult;

    // Parse multipart form data
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const user_type_id = formData.get("user_type_id") as string;
    const entity = formData.get("entity") as string | null;
    const expiry = formData.get("expiry") as string | null;
    const profilePicture = formData.get("profilePicture") as File | null;

    // Validate required fields
    if (!name || !password || !email || !user_type_id) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usertype_query = await prisma.userTypePriv.findUnique({
      where: { id: parseInt(user_type_id) }
    });

    if (!usertype_query) {
      return NextResponse.json(
        { success: false, message: "Invalid user type ID" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findFirst({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    const userData: UserData = {
      name,
      email,
      password: hashedPassword,
      userTypeId: parseInt(user_type_id),
      expiry: expiry ? new Date(expiry) : null,
      isActive: true
    };

    // Handle profile picture
    if (profilePicture) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = profilePicture.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      userData.profilePicture = `/uploads/${fileName}`;
    }

    const entity_type = usertype_query.entity_type;

    // Parse entity if provided
    let entityArray: number[] | undefined;
    if (entity) {
      try {
        entityArray = JSON.parse(entity).map((id: string) => parseInt(id));
      } catch {
        entityArray = entity
          .split(",")
          .map((id: string) => parseInt(id.trim()));
      }
    }

    // switch (entity_type) {
    //   case "admin":
    //     userData.fk_company_entity = [];
    //     break;
    //   case "fleet_director":
    //   case "fleet_manager":
    //     userData.fk_fleet_entity = entityArray ?? [];
    //     break;
    //   case "technical_supd":
    //   case "marine_supd":
    //   case "performance_analyst":
    //   case "developer":
    //   case "support":
    //     userData.fk_vessel_entity = entityArray ?? [];
    //     break;
    //   default:
    //     return NextResponse.json(
    //       { success: false, message: "Unhandled user type" },
    //       { status: 400 }
    //     );
    // }
    userData.fk_usergroup = parseInt(user_type_id)
    await prisma.user.create({ data: userData });

    return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
