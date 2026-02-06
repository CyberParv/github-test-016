import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

const createSchema = z.object({
  url: z.string().url(),
  filename: z.string().min(1),
  contentType: z.string().min(1),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const items = await prisma.upload.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: { items } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch uploads";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const upload = await prisma.upload.create({ data });
    return NextResponse.json({ success: true, data: upload }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create upload";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
