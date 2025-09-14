"use client";

import * as React from "react";

type BaseProps = { className?: string };

/** Use it like: <UserList room="my-room" /> */
type RoomProps = BaseProps & {
  room: string;
  users?: never;
  currentUser?: never;
};

/** Or like: <UserList users={['a','b']} currentUser="a" /> */
type ListProps = BaseProps & {
  users: string[];
  currentUser: string;
  room?: never;
};

type Props = RoomProps | ListProps;

type PresenceUser = {
  username: string;
  lastSeen: string; // ISO
  isLive: boolean;
};

export default function UserList(props: Props) {
  // If called with a room, we’ll fetch presence; otherwise we’ll use the passed list.
  const isRoomMode = "room" in props;
  const room = isRoomMode ? props.room : undefined;

  const [presence, setPresence] = React.useState<PresenceUser[]>([]);
  const [loading, setLoading] = React.useState<boolean>(isRoomMode);

  // Poll presence when in room mode
  React.useEffect(() => {
    if (!isRoomMode || !room) return;

    let stop = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const intervalMs = 15_000;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/presence/list?room=${encodeURIComponent(room)}`,
          { method: "GET", headers: { "cache-control": "no-store" } }
        );
        if (!res.ok) throw new Error("presence fetch failed");
        const data = (await res.json()) as { users?: PresenceUser[] };
        if (!stop) setPresence(Array.isArray(data.users) ? data.users : []);
      } catch {
        if (!stop) setPresence([]);
      } finally {
        if (!stop) setLoading(false);
        if (!stop) timer = setTimeout(load, intervalMs);
      }
    };

    void load();

    return () => {
      stop = true;
      if (timer) clearTimeout(timer);
    };
  }, [isRoomMode, room]);

  const list: PresenceUser[] = React.useMemo(() => {
    if (isRoomMode) {
      // Presence mode — already in desired shape
      return presence
        .slice()
        .sort(
          (a, b) =>
            Number(b.isLive) - Number(a.isLive) ||
            a.username.localeCompare(b.username)
        );
    }
    // Static list mode — adapt usernames into PresenceUser shape
    const { users, currentUser } = props as ListProps;
    return (users ?? [])
      .map<PresenceUser>((u) => ({
        username: u,
        lastSeen: new Date().toISOString(),
        isLive: u === currentUser,
      }))
      .sort(
        (a, b) =>
          Number(b.isLive) - Number(a.isLive) ||
          a.username.localeCompare(b.username)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoomMode, presence, (props as ListProps).users, (props as ListProps).currentUser]);

  return (
    <div
      className={`flex h-full w-80 flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 ${props.className ?? ""}`}
      aria-label="User list"
    >
      <header className="flex items-center justify-between border-b border-neutral-800 px-3 py-2 text-sm">
        <span className="opacity-80">Users</span>
        <span className="text-xs opacity-60">
          {isRoomMode && room ? (
            <>
              room: <span className="font-mono">{room}</span>
            </>
          ) : (
            "static"
          )}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-2">
        {loading && list.length === 0 ? (
          <div className="rounded-md border border-neutral-800 bg-black/20 p-3 text-center text-xs opacity-70">
            Loading users…
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-md border border-neutral-800 bg-black/20 p-3 text-center text-xs opacity-70">
            No users yet.
          </div>
        ) : (
          <ul className="space-y-1">
            {list.map((u) => (
              <li
                key={u.username}
                className="flex items-center justify-between rounded-md border border-neutral-800 bg-black/20 px-2 py-1 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      u.isLive ? "bg-green-500" : "bg-neutral-600"
                    }`}
                    aria-label={u.isLive ? "live" : "offline"}
                  />
                  <span className="font-mono">{u.username}</span>
                </span>
                <span className="text-[10px] opacity-60">
                  {u.isLive ? "live" : "idle"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
