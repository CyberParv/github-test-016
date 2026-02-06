import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasRole } from "./lib/auth";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/stats")) {
    const user = await getUserFromRequest(req);
    if (!user || !hasRole(user, ["admin"])) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
