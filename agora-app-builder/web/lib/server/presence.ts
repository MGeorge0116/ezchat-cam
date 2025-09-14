import type { RoomName, Username } from "@/lib/types";

export type PresenceInfo = {
  username: Username;
  lastSeen: number;     // epoch ms
  isLive: boolean;      // derived from lastSeen freshness
};

const listeners = new Map<RoomName, Set<(data: unknown) => void>>();
const lastSeen = new Map<RoomName, Map<Username, number>>();

export function subscribePresence(room: RoomName, send: (data: unknown) => void) {
  let set = listeners.get(room);
  if (!set) {
    set = new Set();
    listeners.set(room, set);
  }
  set.add(send);
  return () => {
    set?.delete(send);
    if (set && set.size === 0) listeners.delete(room);
  };
}

export async function heartbeat(room: RoomName, username: Username) {
  let map = lastSeen.get(room);
  if (!map) {
    map = new Map();
    lastSeen.set(room, map);
  }
  const now = Date.now();
  map.set(username, now);

  const ev = { type: "heartbeat", room, username, at: now };
  listeners.get(room)?.forEach((cb) => cb(ev));
  return { ok: true };
}

/** Rich list: username + lastSeen + isLive (fresh within 30s) */
export function list(room: RoomName): PresenceInfo[] {
  const map = lastSeen.get(room);
  if (!map) return [];
  const now = Date.now();
  const FRESH_MS = 30_000;

  return Array.from(map.entries()).map(([username, ts]) => ({
    username,
    lastSeen: ts,
    isLive: now - ts < FRESH_MS,
  }));
}
