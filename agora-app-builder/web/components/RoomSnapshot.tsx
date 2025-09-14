"use client";

import * as React from "react";

type Props = {
  room: string;
  username: string;
  className?: string;
};

/**
 * Generates a tiny PNG preview (placeholder) and best-effort POSTs it
 * to your API. If the endpoint isn’t implemented, it silently ignores errors.
 */
export default function RoomSnapshot({ room, username, className }: Props) {
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const stoppedRef = React.useRef(false);

  React.useEffect(() => {
    stoppedRef.current = false;

    const sendSnapshot = async (dataUrl: string) => {
      try {
        // Try a members endpoint first (exists in your repo structure)
        const res = await fetch(
          `/api/rooms/${encodeURIComponent(room)}/members`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, snapshot: dataUrl }),
          }
        );
        // If that 404s or fails, just ignore — this is best-effort only.
        void res;
      } catch {
        /* ignore */
      }
    };

    const take = async () => {
      if (stoppedRef.current) return;

      const cvs = document.createElement("canvas");
      cvs.width = 320;
      cvs.height = 180;
      const ctx = cvs.getContext("2d");

      if (ctx) {
        // background
        ctx.fillStyle = "#0b0b0b";
        ctx.fillRect(0, 0, cvs.width, cvs.height);

        // header
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(0, 0, cvs.width, 28);

        ctx.fillStyle = "#e5e7eb";
        ctx.font =
          "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        ctx.fillText(`room: #${room}`, 10, 18);

        ctx.fillStyle = "#fff";
        ctx.font =
          "14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        ctx.fillText(`@${username}`, 12, 52);

        ctx.fillStyle = "#9ca3af";
        ctx.font =
          "12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
        ctx.fillText(new Date().toLocaleString(), 12, 72);

        // footer
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(0, cvs.height - 22, cvs.width, 22);
        ctx.fillStyle = "#9ca3af";
        ctx.fillText("EZChat.Cam snapshot", 10, cvs.height - 8);
      }

      const dataUrl = cvs.toDataURL("image/png");
      await sendSnapshot(dataUrl);
    };

    // initial + periodic
    void take();
    timerRef.current = setInterval(take, 30_000);

    return () => {
      stoppedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [room, username]);

  return (
    <div
      className={className ?? ""}
      aria-hidden
      data-component="RoomSnapshot"
    />
  );
}
