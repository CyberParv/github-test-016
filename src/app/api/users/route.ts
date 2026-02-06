import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole, hashPassword } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["customer", "staff", "admin"]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const page = Math.max(parseInt(req.nextUrl.searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(req.nextUrl.searchParams.get("limit") || "20", 10), 1);

    const total = await prisma.user.count();
    const items = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch users";
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

    const passwordHash = await hashPassword(data.password);
    const created = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role ?? "customer",
        phone: data.phone,
        address: data.address,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
