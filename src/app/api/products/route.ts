import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
  imageUrl: z.string().url().optional(),
  available: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

function getPaginationParams(req: NextRequest): { page: number; limit: number } {
  const page = Math.max(parseInt(req.nextUrl.searchParams.get("page") || "1", 10), 1);
  const limit = Math.max(parseInt(req.nextUrl.searchParams.get("limit") || "10", 10), 1);
  return { page, limit };
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { page, limit } = getPaginationParams(req);
    const category = req.nextUrl.searchParams.get("category");
    const tag = req.nextUrl.searchParams.get("tag");
    const q = req.nextUrl.searchParams.get("q");
    const sort = req.nextUrl.searchParams.get("sort") || "createdAt";
    const order = req.nextUrl.searchParams.get("order") || "desc";

    let categoryId: string | undefined;
    if (category) {
      const cat = await prisma.category.findFirst({ where: { OR: [{ id: category }, { slug: category }] } });
      categoryId = cat?.id;
    }

    const where = {
      ...(categoryId ? { categoryId } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" as const } }, { description: { contains: q, mode: "insensitive" as const } }] } : {}),
    };

    const total = await prisma.product.count({ where });
    const items = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { [sort]: order === "asc" ? "asc" : "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
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

    const product = await prisma.product.create({
      data: {
        ...data,
        available: data.available ?? true,
        tags: data.tags ?? [],
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
