import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

const createSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const page = Math.max(parseInt(req.nextUrl.searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(req.nextUrl.searchParams.get("limit") || "10", 10), 1);

    const where = { productId: params.id };
    const total = await prisma.review.count({ where });
    const items = await prisma.review.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reviews";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const data = createSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: params.id,
        rating: data.rating,
        comment: data.comment,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create review";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
