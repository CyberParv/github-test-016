import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

const createSchema = z.object({
  date: z.string(),
  time: z.string().min(2),
  partySize: z.number().min(1),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const date = req.nextUrl.searchParams.get("date");
    const status = req.nextUrl.searchParams.get("status");

    const where = {
      ...(date ? { date: new Date(date) } : {}),
      ...(status ? { status } : {}),
      ...(hasRole(user, ["admin", "staff"]) ? {} : { userId: user.id }),
    };

    const items = await prisma.reservation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: { items } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reservations";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();
    const data = createSchema.parse(body);

    const reservation = await prisma.reservation.create({
      data: {
        userId: user?.id,
        date: new Date(data.date),
        time: data.time,
        partySize: data.partySize,
        status: "pending",
        notes: data.notes,
      },
    });

    return NextResponse.json({ success: true, data: reservation }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create reservation";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
