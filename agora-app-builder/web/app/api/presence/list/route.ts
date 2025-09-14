import { NextRequest, NextResponse } from "next/server";
import { list } from "@/lib/server/presence";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  if (!room) {
    return NextResponse.json({ error: "Missing room" }, { status: 400 });
  }

  const users = (await list(room)).map((u) => ({
    username: u.username,
    lastSeen: new Date(u.lastSeen).toISOString(),
    isLive: !!u.isLive,
  }));

  return NextResponse.json({ users });
}
