import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const items = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: { items } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to search";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
