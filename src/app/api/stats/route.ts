import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const salesTodayAgg = await prisma.order.aggregate({
      where: { createdAt: { gte: startOfDay }, status: "completed" },
      _sum: { total: true },
    });

    const ordersOpen = await prisma.order.count({
      where: { status: { in: ["received", "preparing", "ready"] } },
    });

    const orders = await prisma.order.findMany({
      where: { status: "completed" },
      select: { items: true },
    });

    const productCounts: Record<string, { name: string; sold: number }> = {};
    orders.forEach((order) => {
      const items = order.items as Array<{ productId: string; name: string; quantity: number }>;
      items.forEach((item) => {
        if (!productCounts[item.productId]) {
          productCounts[item.productId] = { name: item.name, sold: 0 };
        }
        productCounts[item.productId].sold += item.quantity;
      });
    });

    const topProducts = Object.entries(productCounts)
      .map(([productId, value]) => ({ productId, name: value.name, sold: value.sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return NextResponse.json(
      {
        success: true,
        data: {
          salesToday: salesTodayAgg._sum.total || 0,
          ordersOpen,
          topProducts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
