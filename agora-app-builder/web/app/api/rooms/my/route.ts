import { NextRequest, NextResponse } from "next/server";
import { listRooms } from "@/lib/rooms";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  // Return whatever the UI expects; ownerId not tracked in memory → null.
  const rooms = listRooms().map((r) => ({
    name: r.name,
    ownerId: null as string | null,
  }));

  return NextResponse.json({ rooms });
}
