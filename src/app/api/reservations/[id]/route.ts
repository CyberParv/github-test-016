import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

const updateSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  partySize: z.number().min(1).optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const reservation = await prisma.reservation.findUnique({ where: { id: params.id } });
    if (!reservation) {
      return NextResponse.json({ success: false, error: "Reservation not found" }, { status: 404 });
    }

    if (!hasRole(user, ["admin", "staff"]) && reservation.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: reservation }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reservation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const reservation = await prisma.reservation.findUnique({ where: { id: params.id } });
    if (!reservation) {
      return NextResponse.json({ success: false, error: "Reservation not found" }, { status: 404 });
    }

    if (!hasRole(user, ["admin", "staff"]) && reservation.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        ...(data.date ? { date: new Date(data.date) } : {}),
        ...(data.time ? { time: data.time } : {}),
        ...(data.partySize ? { partySize: data.partySize } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.notes ? { notes: data.notes } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update reservation";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin", "staff"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await prisma.reservation.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete reservation";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
