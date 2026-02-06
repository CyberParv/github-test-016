import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

const createSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1),
  })),
  pickupOrDelivery: z.enum(["pickup", "delivery"]),
  paymentMethod: z.string().min(2),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const page = Math.max(parseInt(req.nextUrl.searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(req.nextUrl.searchParams.get("limit") || "20", 10), 1);
    const status = req.nextUrl.searchParams.get("status");
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");

    const where = {
      ...(status ? { status } : {}),
      ...(from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
      ...(hasRole(user, ["admin", "staff"]) ? {} : { userId: user.id }),
    };

    const total = await prisma.order.count({ where });
    const items = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({ success: true, data: { items, total, page, limit } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const data = createSchema.parse(body);

    const products = await prisma.product.findMany({
      where: { id: { in: data.items.map((i) => i.productId) } },
    });

    const items = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error("Invalid product");
      }
      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    const order = await prisma.order.create({
      data: {
        userId: user?.id,
        items,
        subtotal,
        tax,
        total,
        status: "received",
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
        pickupOrDelivery: data.pickupOrDelivery,
      },
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
