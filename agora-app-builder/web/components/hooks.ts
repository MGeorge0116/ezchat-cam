"use client";

import { useEffect, useRef } from "react";

type HeartbeatOptions = {
  /** How often to ping (ms). Default: 15000 */
  intervalMs?: number;
  /** Disable the heartbeat loop */
  enabled?: boolean;
  /** Optional error sink */
  onError?: (err: unknown) => void;
};

/**
 * Periodically pings the server to mark a room as active.
 * Used by RoomShell.
 */
export function useRoomHeartbeat(
  room: string | undefined,
  opts?: HeartbeatOptions
) {
  const { intervalMs = 15_000, enabled = true, onError } = opts ?? {};
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // no room or disabled → no-op
    if (!room || !enabled) return;

    let stopped = false;

    const beat = async () => {
      // clear any previous timer (defensive)
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      try {
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        await fetch(
          `/api/rooms/heartbeat?room=${encodeURIComponent(room)}`,
          {
            method: "POST",
            signal: abortRef.current.signal,
            headers: { "content-type": "application/json" },
          }
        );
      } catch (err) {
        // ignore aborts; surface other errors if caller cares
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          onError?.(err);
        }
      } finally {
        if (!stopped) {
          timerRef.current = setTimeout(beat, intervalMs);
        }
      }
    };

    // kick off loop
    void beat();

    return () => {
      stopped = true;
      abortRef.current?.abort();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [room, enabled, intervalMs, onError]);
}
