import { NextRequest, NextResponse } from "next/server";
import { upsertRoom } from "@/lib/rooms";
import { requireStrings } from "@/lib/guards";

export const runtime = "nodejs";

type UpsertBody = {
  room: string;
  title?: string;
  usersCount?: number | string;
  camsCount?: number | string; // broadcasters
};

export async function POST(req: NextRequest) {
  const bodyUnknown: unknown = await req.json();
  if (!requireStrings(bodyUnknown, ["room"])) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { room, title, usersCount, camsCount } = bodyUnknown as UpsertBody;

  const users =
    typeof usersCount === "string" ? Number(usersCount) : usersCount;
  const broadcasters =
    typeof camsCount === "string" ? Number(camsCount) : camsCount;

  upsertRoom(room, {
    title: title ?? undefined,
    users: Number.isFinite(users as number) ? (users as number) : undefined,
    broadcasters: Number.isFinite(broadcasters as number)
      ? (broadcasters as number)
      : undefined,
    isLive:
      (Number.isFinite(users as number) && (users as number) > 0) ||
      (Number.isFinite(broadcasters as number) &&
        (broadcasters as number) > 0) ||
      undefined,
  });

  return NextResponse.json({ ok: true });
}
