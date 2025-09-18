import fs from "fs/promises";
import { Agent } from "http"; // Import Agent for connection pooling

import path from "path";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables.");
}

// Initialize Prisma Client
const prisma = new PrismaClient();

// Configure Axios with a custom agent for connection pooling
const axiosInstance = axios.create({
  httpAgent: new Agent({ keepAlive: true, maxSockets: 50 }), // Increase max concurrent connections
  httpsAgent: new Agent({ keepAlive: true, maxSockets: 50 })
});

export async function POST(req: NextRequest) {
  try {
    // const authResult = await authMiddleware(req);
    // if (authResult instanceof NextResponse) return authResult;

    // const auth_usertype = authResult;

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const email = formData.get("email") as string;

    if (!imageFile) {
      return NextResponse.json(
        { success: false, message: "Missing image file" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing email" },
        { status: 400 }
      );
    }

    try {
      // Query the database for the user by email
      const user = await prisma.user.findUnique({
        where: { email },
        select: { profilePicture: true }
      });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      const forwardFormData = new FormData();
      forwardFormData.append("image", imageFile); // Append uploaded image

      // If profile picture exists, fetch and append it
      if (user.profilePicture) {
        try {
          // Construct the file path by prepending 'public' to the profilePicture path
          const profilePicturePath = path.join("public", user.profilePicture);
          const absolutePath = path.resolve(process.cwd(), profilePicturePath);

          // Verify file existence
          await fs.access(absolutePath, fs.constants.F_OK);

          // Read the file and convert to Blob
          const fileBuffer = await fs.readFile(absolutePath);
          const profilePictureBlob = new Blob([fileBuffer], {
            type: "image/jpeg"
          });
          forwardFormData.append(
            "profilePicture",
            profilePictureBlob,
            path.basename(user.profilePicture)
          );
        } catch (error: any) {
          console.error("Error reading profile picture:", error.message);
          // Continue without profile picture if it fails
        }
      }

      forwardFormData.append("email", email); // Add email to FormData
      try {
        const response = await axiosInstance.post(
          "http://192.168.18.206:5004/image/response/",
          forwardFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            },
            timeout: 30000 // Set a reasonable timeout (30 seconds)
          }
        );
        if (response.data.success === true) {
          const userQuery = await prisma.user.findUnique({
            where: { email }
          });

          if (!userQuery) {
            return NextResponse.json(
              { success: false, message: "User not found" },
              { status: 404 }
            );
          }

          let token: string;
          const token_expiry =
            (process.env.JWT_TOKEN_EXPIRY as Pick<
              jwt.SignOptions,
              "expiresIn"
            >["expiresIn"]) || "0.5h";

          if (userQuery.isSuperuser) {
            token = jwt.sign(
              {
                id: userQuery.id,
                email: userQuery.email,
                userType: userQuery.userTypeId
              },
              JWT_SECRET_KEY,
              { expiresIn: "720h" }
            );
          } else {
            token = jwt.sign(
              {
                id: userQuery.id,
                email: userQuery.email,
                userType: userQuery.userTypeId
              },
              JWT_SECRET_KEY,
              { expiresIn: token_expiry }
            );
          }

          return NextResponse.json(
            {
              success: true,
              timeout: false,
              token,
              is_superuser: userQuery.isSuperuser,
              email: email,
              userType: userQuery.userTypeId,
              company_entity: userQuery.fk_company_entity,
              fleet_entity: userQuery.fk_fleet_entity,
              vessel_entity: userQuery.fk_vessel_entity
            },
            { status: 200 }
          );
        } else {
          return NextResponse.json(
            { success: false, data: null },
            { status: 500 }
          );
        }
      } catch (error: any) {
        console.error("Error forwarding data:", error.message);
        return NextResponse.json(
          {
            success: false,
            message: `Error processing data: ${error.message}`
          },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error("Error handling request:", error.message);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  } catch (error: any) {
    console.error("Error in endpoint:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
