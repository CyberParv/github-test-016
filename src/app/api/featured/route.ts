import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const limit = Math.max(parseInt(req.nextUrl.searchParams.get("limit") || "6", 10), 1);
    const items = await prisma.product.findMany({
      where: { tags: { has: "featured" }, available: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, data: { items } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch featured";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
