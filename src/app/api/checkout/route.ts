import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1),
  })).optional(),
  pickupOrDelivery: z.enum(["pickup", "delivery"]),
  paymentMethod: z.string().min(2),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const data = checkoutSchema.parse(body);

    let items = data.items;

    if (!items && user) {
      const cart = await prisma.order.findFirst({ where: { userId: user.id, status: "cart" } });
      if (cart) {
        items = cart.items as Array<{ productId: string; quantity: number }>;
      }
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items to checkout" }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    const orderItems = items.map((item) => {
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

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    const order = await prisma.order.create({
      data: {
        userId: user?.id,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: "received",
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
        pickupOrDelivery: data.pickupOrDelivery,
      },
    });

    if (user) {
      await prisma.order.deleteMany({ where: { userId: user.id, status: "cart" } });
    }

    return NextResponse.json({ success: true, data: { orderId: order.id, status: order.status, total: order.total } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
