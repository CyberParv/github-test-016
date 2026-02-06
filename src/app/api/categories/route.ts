import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const page = Math.max(parseInt(req.nextUrl.searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(req.nextUrl.searchParams.get("limit") || "50", 10), 1);

    const items = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await prisma.category.count();

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch categories";
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

    const category = await prisma.category.create({ data });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
