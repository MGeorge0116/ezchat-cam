"use client";

import * as React from "react";

export interface ControlsBarProps {
  className?: string;
  muted?: boolean;
  camOff?: boolean;
  deafened?: boolean;
  onToggleMic?: () => void | Promise<void>;
  onToggleCam?: () => void | Promise<void>;
  onToggleDeafen?: () => void | Promise<void>;
  onLeave?: () => void | Promise<void>;
  // allow extra props without `any`
  [key: string]: unknown;
}

export default function ControlsBar({
  className,
  muted,
  camOff,
  deafened,
  onToggleMic,
  onToggleCam,
  onToggleDeafen,
  onLeave,
}: ControlsBarProps) {
  const click =
    (fn?: () => void | Promise<void>) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      void fn?.();
    };

  return (
    <div
      className={`flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 p-3 ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={click(onToggleMic)}
        className="rounded-2xl bg-neutral-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
        aria-pressed={!!muted}
        title={muted ? "Unmute mic" : "Mute mic"}
      >
        {muted ? "Unmute Mic" : "Mute Mic"}
      </button>

      <button
        type="button"
        onClick={click(onToggleCam)}
        className="rounded-2xl bg-neutral-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
        aria-pressed={!!camOff}
        title={camOff ? "Turn camera on" : "Turn camera off"}
      >
        {camOff ? "Camera On" : "Camera Off"}
      </button>

      <button
        type="button"
        onClick={click(onToggleDeafen)}
        className="rounded-2xl bg-neutral-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800"
        aria-pressed={!!deafened}
        title={deafened ? "Undeafen" : "Deafen"}
      >
        {deafened ? "Undeafen" : "Deafen"}
      </button>

      <button
        type="button"
        onClick={click(onLeave)}
        className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        title="Leave room"
      >
        Leave
      </button>
    </div>
  );
}
