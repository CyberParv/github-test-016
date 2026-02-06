import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

const cartSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1),
  })),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.order.findFirst({
      where: { userId: user.id, status: "cart" },
    });

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch cart";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = cartSchema.parse(body);

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

    const existing = await prisma.order.findFirst({
      where: { userId: user.id, status: "cart" },
    });

    const cart = existing
      ? await prisma.order.update({
          where: { id: existing.id },
          data: { items, subtotal, tax, total, paymentMethod: "none", paymentStatus: "unpaid", pickupOrDelivery: "pickup" },
        })
      : await prisma.order.create({
          data: { userId: user.id, items, subtotal, tax, total, status: "cart", paymentMethod: "none", paymentStatus: "unpaid", pickupOrDelivery: "pickup" },
        });

    return NextResponse.json({ success: true, data: cart }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update cart";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await prisma.order.deleteMany({ where: { userId: user.id, status: "cart" } });
    return NextResponse.json({ success: true, data: { cleared: true } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to clear cart";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
