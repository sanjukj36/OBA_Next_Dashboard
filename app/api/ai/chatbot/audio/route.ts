import { Agent } from "http"; // Import Agent for connection pooling
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";

// Configure Axios with a custom agent for connection pooling
const axiosInstance = axios.create({
  httpAgent: new Agent({ keepAlive: true, maxSockets: 50 }), // Increase max concurrent connections
  httpsAgent: new Agent({ keepAlive: true, maxSockets: 50 })
});

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult;

    if (auth_usertype) {
      const formData = await req.formData();
      const audioFile = formData.get("audio") as File;

      if (!audioFile) {
        return NextResponse.json(
          { success: false, message: "Missing audio file" },
          { status: 400 }
        );
      }

      try {
        const forwardFormData = new FormData();
        forwardFormData.append("audio", audioFile);

        try {
          const AIBaseURL = process.env.AI_URL as string;
          const response = await axiosInstance.post(
            `${AIBaseURL}/audio/response/`,
            forwardFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data"
              },
              timeout: 30000 // Set a reasonable timeout (30 seconds)
            }
          );
          if (response.data.success == true) {
            return NextResponse.json(
              { success: true, data: response.data },
              { status: 200 }
            );
          } else {
            return NextResponse.json(
              { success: false, data: null },
              { status: 500 }
            );
          }
        } catch (error: any) {
          console.error("Error forwarding audio:", error.message);
          return NextResponse.json(
            {
              success: false,
              message: `Error processing audio: ${error.message}`
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
      }
    } else {
      return NextResponse.json(
        { success: false, data: null, message: "Unauthorized" },
        { status: 403 }
      );
    }
  } catch (error: any) {
    console.error("Error in endpoint:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
