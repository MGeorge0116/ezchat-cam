"use client";

import * as React from "react";

export interface VideoStageHandle {
  /** Focus a specific participant (stub) */
  focus: (username: string | null) => void;
  /** Reset layout (stub) */
  reset: () => void;

  /** Toggle local microphone; resolves to the new ON state */
  toggleMic: () => Promise<boolean>;
  /** Toggle local camera; resolves to the new ON state */
  toggleCam: () => Promise<boolean>;
  /** Toggle local deafen; resolves to the new DEAFENED state */
  toggleDeafen: () => Promise<boolean>;
  /** Toggle local screen share; resolves to the new ON state */
  toggleScreen: () => Promise<boolean>;
}

export interface VideoStageProps {
  /** Old name */
  room?: string;
  /** Alt name some callers use */
  channelName?: string;

  localUsername?: string;
  className?: string;
  joined?: boolean; // accepted but only used for UI hint
  onReady?: () => void | Promise<void>;
}

const VideoStage = React.forwardRef<VideoStageHandle, VideoStageProps>(
  ({ room, channelName, localUsername, className, joined, onReady }, ref) => {
    const name = room ?? channelName ?? "room";

    const [micOn, setMicOn] = React.useState<boolean>(true);
    const [camOn, setCamOn] = React.useState<boolean>(true);
    const [deafened, setDeafened] = React.useState<boolean>(false);
    const [screenOn, setScreenOn] = React.useState<boolean>(false);

    React.useImperativeHandle(ref, () => ({
      focus: () => {
        /* no-op stub */
      },
      reset: () => {
        /* no-op stub */
      },
      toggleMic: async () => {
        let next = false;
        setMicOn((prev) => (next = !prev));
        return next;
      },
      toggleCam: async () => {
        let next = false;
        setCamOn((prev) => (next = !prev));
        return next;
      },
      toggleDeafen: async () => {
        let next = false;
        setDeafened((prev) => (next = !prev));
        return next;
      },
      toggleScreen: async () => {
        let next = false;
        setScreenOn((prev) => (next = !prev));
        return next;
      },
    }));

    React.useEffect(() => {
      void onReady?.();
    }, [onReady]);

    return (
      <div
        className={`flex h-full w-full items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 ${className ?? ""}`}
        aria-label="Video stage"
      >
        <div className="text-center text-sm opacity-90">
          <div className="font-semibold">Video Stage</div>
          <div className="mt-1">
            Room: <span className="font-mono">{name}</span>
            {typeof joined === "boolean" && (
              <span className={`ml-2 rounded px-2 py-0.5 text-xs ${joined ? "bg-green-700" : "bg-neutral-700"} text-white`}>
                {joined ? "Joined" : "Not joined"}
              </span>
            )}
          </div>
          {localUsername && (
            <div className="mt-1">
              You: <span className="font-mono">{localUsername}</span>
            </div>
          )}
          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
            <span className={`rounded px-2 py-1 ${micOn ? "bg-green-700" : "bg-neutral-700"} text-white`}>
              Mic: {micOn ? "On" : "Off"}
            </span>
            <span className={`rounded px-2 py-1 ${camOn ? "bg-green-700" : "bg-neutral-700"} text-white`}>
              Cam: {camOn ? "On" : "Off"}
            </span>
            <span className={`rounded px-2 py-1 ${screenOn ? "bg-green-700" : "bg-neutral-700"} text-white`}>
              Screen: {screenOn ? "On" : "Off"}
            </span>
            <span className={`rounded px-2 py-1 ${deafened ? "bg-red-700" : "bg-neutral-700"} text-white`}>
              {deafened ? "Deafened" : "Audio Out"}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

VideoStage.displayName = "VideoStage";
export default VideoStage;
