import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

const updateSchema = z.object({
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  pickupOrDelivery: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (!hasRole(user, ["admin", "staff"]) && order.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin", "staff"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.order.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await prisma.order.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
