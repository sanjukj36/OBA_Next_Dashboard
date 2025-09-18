import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/authMiddleware";

interface chatText {
  chat: string;
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) return authResult;

    const auth_usertype = authResult;

    if (auth_usertype) {
      const body: chatText = await req.json();
      const chat = body.chat;

      if (!chat) {
        return NextResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }

      try {
        try {
          const AIBaseURL = process.env.AI_URL as string;

          const response = await axios.post(`${AIBaseURL}/chat/response/`, {
            chat: chat
          });

          return NextResponse.json(
            { success: true, data: response.data },
            { status: 200 }
          );
        } catch (error) {
          console.error("Error:", error);
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "error" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ success: false, data: null }, { status: 403 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
