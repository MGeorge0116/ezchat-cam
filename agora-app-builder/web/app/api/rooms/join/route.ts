import { NextRequest, NextResponse } from "next/server";
import { upsertRoom } from "@/lib/rooms";
import { requireStrings } from "@/lib/guards";

export const runtime = "nodejs";

type JoinBody = {
  room: string;
  ownerUsername?: string | null;
};

export async function POST(req: NextRequest) {
  const bodyUnknown: unknown = await req.json();
  if (!requireStrings(bodyUnknown, ["room"])) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { room, ownerUsername } = bodyUnknown as JoinBody;

  // Track room in memory; avoid Prisma fields that don't exist
  upsertRoom(room, {
    title: room.toUpperCase(),
    isLive: true,
    promoted: false,
    // You can stash ownerUsername in memory too by extending RoomRecord if desired
    // but we won't touch Prisma here to keep builds green.
  });

  return NextResponse.json({
    ok: true,
    room: room.toLowerCase(),
    ownerUsername: ownerUsername?.toLowerCase() ?? null,
  });
}
