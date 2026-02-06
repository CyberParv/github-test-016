import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ success: true, data: { status: "ok", version: "1.0.0", time: new Date().toISOString() } }, { status: 200 });
}
