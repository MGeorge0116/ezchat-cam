import type { RoomName } from "@/lib/types";

export interface RoomRecord {
  name: RoomName;
  title?: string | null;
  promoted?: boolean;
  isLive?: boolean;
  broadcasters?: number;
  users?: number;
  updatedAt: number;
}

type Stats = { broadcasters: number; users: number };

const rooms = new Map<RoomName, RoomRecord>();
const stats = new Map<RoomName, Stats>();

/** Upsert by name; accepts either (name, data) or a single object with name. */
export function upsertRoom(
  nameOrObj: string | (Partial<RoomRecord> & { name: string }),
  data?: Partial<RoomRecord>
): RoomRecord {
  const name = typeof nameOrObj === "string" ? nameOrObj : nameOrObj.name;
  const existing = rooms.get(name) ?? { name, updatedAt: Date.now() };
  const patch = (typeof nameOrObj === "string" ? data : nameOrObj) ?? {};
  const next: RoomRecord = {
    ...existing,
    ...patch,
    name,
    updatedAt: Date.now(),
  };
  rooms.set(name, next);

  // keep stats in sync if provided
  if (typeof next.broadcasters === "number" || typeof next.users === "number") {
    stats.set(name, {
      broadcasters: next.broadcasters ?? (stats.get(name)?.broadcasters ?? 0),
      users: next.users ?? (stats.get(name)?.users ?? 0),
    });
  }
  return next;
}

/** List all rooms (most recently updated first). */
export function listRooms(): RoomRecord[] {
  return Array.from(rooms.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}

/** Read-only stats accessor used by /api/rooms/[name]/stats */
export function getRoomStats(room: RoomName): Stats {
  return stats.get(room) ?? { broadcasters: 0, users: 0 };
}

/** Optional: setter others can use to update stats directly. */
export function setRoomStats(room: RoomName, s: Stats) {
  stats.set(room, s);
}
