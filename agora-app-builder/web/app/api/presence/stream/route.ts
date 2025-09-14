export const runtime = "nodejs";
export const dynamic = 'force-dynamic';


import { NextRequest } from "next/server";
import { subscribePresence } from "@/lib/server/presence";



type WithSignal = { signal: AbortSignal };
const hasSignal = (x: unknown): x is WithSignal =>
  typeof x === "object" && x !== null && "signal" in x;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  if (!room) return new Response("Missing room", { status: 400 });

  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();

      const send = (data: unknown) => {
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const unsub = subscribePresence(room, send);

      // tell the client we’re connected
      controller.enqueue(enc.encode(`event: ready\ndata: {}\n\n`));

      const close = () => {
        unsub();
        controller.close();
      };

      if (hasSignal(req)) {
        req.signal.addEventListener("abort", close);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
