// Lightweight directory helpers for the HomeDirectory UI (no server deps).

export interface DirectoryRoomMeta {
  username: string;
  isLive: boolean;
  promoted?: boolean;
  watching?: number;
  broadcasters?: number; // 👈 add this
  avatarDataUrl?: string | null;
  description?: string | null;
  lastSeen: number; // epoch ms
}

export type DirectoryRoom = DirectoryRoomMeta;

export interface DirectoryReport {
  rooms: DirectoryRoomMeta[];
}

/** Tolerant normalizer for unknown input into a DirectoryReport shape. */
export function compileDirectoryReport(input: unknown): DirectoryReport {
  if (Array.isArray(input)) {
    return { rooms: input.filter(isRoomMeta) };
  }
  if (isReport(input)) return input;
  return { rooms: [] };
}

/** Return only currently live rooms, sorted by viewers desc then username. */
export function listActiveRooms(
  input?: DirectoryReport | DirectoryRoomMeta[] | null | undefined
): DirectoryRoomMeta[] {
  const rooms = Array.isArray(input)
    ? input
    : isReport(input)
    ? input.rooms
    : [];

  return rooms
    .filter((r) => !!r && r.isLive)
    .sort(
      (a, b) =>
        (b.watching ?? 0) - (a.watching ?? 0) ||
        a.username.localeCompare(b.username)
    );
}

/* ───────────── internal guards ───────────── */

function isRoomMeta(x: unknown): x is DirectoryRoomMeta {
  return (
    !!x &&
    typeof (x as any).username === "string" &&
    typeof (x as any).isLive === "boolean"
  );
}
function isReport(x: unknown): x is DirectoryReport {
  return !!x && Array.isArray((x as any).rooms);
}
