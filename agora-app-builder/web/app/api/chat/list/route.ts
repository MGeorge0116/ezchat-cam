// app/api/chat/list/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Message = {
  id: string | number;
  text: string;
  username: string;
  createdAt?: string | number | Date | null;
};

export async function GET() {
  // TODO: replace with your real data fetch
  const messages: Message[] = [];

  return NextResponse.json({
    messages: messages.map((m: Message) => ({
      id: String(m.id),
      text: m.text,
      username: m.username,
      createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : null,
    })),
  });
}
