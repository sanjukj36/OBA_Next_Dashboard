import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface UserData {
  name?: string;
  email?: string;
  password?: string;
  userTypeId?: number;
  expiry?: Date | null;
  fk_company_entity?: number[];
  fk_fleet_entity?: number[];
  fk_vessel_entity?: number[];
  isActive?: boolean;
  profilePicture?: string;
}

export async function PUT(req: NextRequest) {
  try {
    // const authResult = await authMiddleware(req);
    // if (authResult instanceof NextResponse) return authResult;

    // Get user ID from query parameters
    const userId = req.nextUrl.searchParams.get("id");
    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing user ID" },
        { status: 400 }
      );
    }

    // Parse multipart form data
    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const user_type_id = formData.get("user_type_id") as string | null;
    const entity = formData.get("entity") as string | null;
    const expiry = formData.get("expiry") as string | null;
    const profilePicture = formData.get("profilePicture") as File | null;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userData: UserData = {};

    // Handle name update
    if (name) {
      userData.name = name;
    }

    // Handle email update
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: { email, NOT: { id: parseInt(userId) } }
      });
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: "Email already exists" },
          { status: 409 }
        );
      }
      userData.email = email;
    }

    // Handle password update
    // if (password) {
    //   userData.password = await bcrypt.hash(password, 10);
    // }

    // Handle profile picture update
    if (profilePicture) {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExtension = profilePicture.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      const buffer = Buffer.from(await profilePicture.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      userData.profilePicture = `/uploads/${fileName}`;

      // Optionally delete the old profile picture if it exists
      if (existingUser.profilePicture) {
        const oldFilePath = path.join(
          process.cwd(),
          "public",
          existingUser.profilePicture
        );
        await fs.unlink(oldFilePath).catch(() => {}); // Ignore if file doesn't exist
      }
    }

    // Handle user type update
    if (user_type_id) {
      const userTypeId = parseInt(user_type_id);
      if (isNaN(userTypeId)) {
        return NextResponse.json(
          { success: false, message: "Invalid user_type_id" },
          { status: 400 }
        );
      }

      const usertype_query = await prisma.userTypePriv.findUnique({
        where: { id: userTypeId }
      });

      if (!usertype_query) {
        return NextResponse.json(
          { success: false, message: "Invalid user type ID" },
          { status: 400 }
        );
      }

      userData.userTypeId = userTypeId;

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

      // Handle entity assignments based on user type
      // switch (entity_type) {
      //   case "admin":
      //     userData.fk_company_entity = [];
      //     userData.fk_fleet_entity = [];
      //     userData.fk_vessel_entity = [];
      //     break;
      //   case "fleet_director":
      //   case "fleet_manager":
      //     userData.fk_fleet_entity = entityArray ?? [];
      //     userData.fk_company_entity = [];
      //     userData.fk_vessel_entity = [];
      //     break;
      //   case "technical_supd":
      //   case "marine_supd":
      //   case "performance_analyst":
      //   case "developer":
      //   case "support":
      //     userData.fk_vessel_entity = entityArray ?? [];
      //     userData.fk_company_entity = [];
      //     userData.fk_fleet_entity = [];
      //     break;
      //   default:
      //     return NextResponse.json(
      //       { success: false, message: "Unhandled user type" },
      //       { status: 400 }
      //     );
      // }
    }

    // Handle expiry update
    if (expiry) {
      userData.expiry = new Date(expiry);
    }

    // Update user
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: userData
    });

    return NextResponse.json(
      { success: true, message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("User Update Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
