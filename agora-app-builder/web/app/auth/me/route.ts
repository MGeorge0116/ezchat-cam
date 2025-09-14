import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(SESSION_COOKIE)?.value ?? "";
    const payload = await verifyToken(cookie); // <-- await it
    if (!payload?.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Minimal response; expand to fetch from DB if you want more fields.
    return NextResponse.json(
      { user: { id: payload.userId } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
