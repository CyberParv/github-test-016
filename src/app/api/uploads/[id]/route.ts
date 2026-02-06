import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest, hasRole } from "@/lib/auth";

const updateSchema = z.object({
  url: z.string().url().optional(),
  filename: z.string().optional(),
  contentType: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const upload = await prisma.upload.findUnique({ where: { id: params.id } });
    if (!upload) {
      return NextResponse.json({ success: false, error: "Upload not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: upload }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch upload";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.upload.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update upload";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await prisma.upload.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete upload";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
