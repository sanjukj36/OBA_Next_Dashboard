import { NextResponse } from "next/server";
import { getApiDocs } from "@/lib/swagger"; // Import your Swagger function

export async function GET() {
  const spec = await getApiDocs();
  return NextResponse.json(spec);
}
