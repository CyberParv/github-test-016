import { NextRequest, NextResponse } from "next/server";
import { getBearerToken, revokeToken } from "@/lib/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const token = getBearerToken(req);
    if (token) {
      await revokeToken(token);
    }
    return NextResponse.json({ success: true, data: { message: "Logged out" } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to logout";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
