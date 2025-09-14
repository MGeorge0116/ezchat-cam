"use client";

import * as React from "react";

export interface VideoGridProps {
  room?: string; // accepted for callers like <VideoGrid room={...} />
  className?: string;
  participants?: { username: string; isLocal?: boolean }[];
  [key: string]: unknown; // allow extra props without `any`
}

export default function VideoGrid({
  room,
  className,
  participants,
  ...rest
}: VideoGridProps) {
  const people = participants ?? [];

  return (
    <div
      className={`grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 ${className ?? ""}`}
      {...rest}
    >
      {people.length === 0 ? (
        <div className="col-span-full rounded-lg border border-neutral-800 bg-neutral-900/40 p-6 text-center text-sm opacity-80">
          No participants yet{room ? (
            <>
              {" "}
              in <span className="font-mono">{room}</span>
            </>
          ) : null}
          .
        </div>
      ) : (
        people.map((p) => (
          <div
            key={p.username}
            className="aspect-video rounded-lg border border-neutral-800 bg-black/40 p-2"
            aria-label={`Video tile for ${p.username}`}
          >
            <div className="flex h-full items-end justify-between">
              <span className="rounded bg-black/60 px-2 py-1 text-xs text-white">
                {p.username} {p.isLocal ? "(you)" : ""}
              </span>
              <span className="rounded bg-black/40 px-2 py-1 text-[10px] text-white/80">
                preview
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
