"use client";

import * as React from "react";

export interface BroadcastControlsProps {
  room?: string; // ✅ allow <BroadcastControls room={room} />
  isBroadcasting?: boolean;
  onToggleBroadcast?: (next: boolean) => void | Promise<void>;
  onStartBroadcast?: () => void | Promise<void>;
  onStopBroadcast?: () => void | Promise<void>;
  className?: string;
  [key: string]: unknown; // allow extra props without `any`
}

export default function BroadcastControls({
  room,
  isBroadcasting,
  onToggleBroadcast,
  onStartBroadcast,
  onStopBroadcast,
  className,
  ...rest
}: BroadcastControlsProps) {
  const [live, setLive] = React.useState<boolean>(!!isBroadcasting);

  // keep internal state in sync with external prop
  React.useEffect(() => {
    setLive(!!isBroadcasting);
  }, [isBroadcasting]);

  const start = async () => {
    if (onStartBroadcast) await onStartBroadcast();
    else if (onToggleBroadcast) await onToggleBroadcast(true);
    setLive(true);
  };

  const stop = async () => {
    if (onStopBroadcast) await onStopBroadcast();
    else if (onToggleBroadcast) await onToggleBroadcast(false);
    setLive(false);
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 ${className ?? ""}`}
      {...rest}
    >
      <span className="text-sm opacity-80">
        Broadcast:{" "}
        <strong className={live ? "text-green-400" : "text-neutral-300"}>
          {live ? "LIVE" : "off"}
        </strong>
      </span>

      <button
        type="button"
        onClick={live ? stop : start}
        className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
          live ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
        title={live ? "Stop broadcast" : "Start broadcast"}
      >
        {live ? "Stop" : "Go Live"}
      </button>

      {room ? (
        <span className="ml-auto text-xs opacity-60">
          room: <span className="font-mono">{room}</span>
        </span>
      ) : null}
    </div>
  );
}
