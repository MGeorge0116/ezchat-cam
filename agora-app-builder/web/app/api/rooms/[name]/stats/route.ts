import { NextRequest, NextResponse } from "next/server";
import { getRoomStats } from "@/lib/rooms";
import type { RoomStatsResponse } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const s = getRoomStats(name);
  const payload: RoomStatsResponse = {
    room: name,
    broadcasters: s.broadcasters,
    users: s.users,
  };
  return NextResponse.json(payload);
}
