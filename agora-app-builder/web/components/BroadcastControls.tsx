"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StartPayload = {
  stream: MediaStream;
  constraints: MediaStreamConstraints;
  room?: string;
};

type StopPayload = {
  room?: string;
};

type DeafenPayload = {
  deafened: boolean;
  room?: string;
};

interface BroadcastControlsProps {
  /** Optional: room/channel name (passed through in CustomEvent payloads) */
  room?: string;
}

export default function BroadcastControls({ room }: BroadcastControlsProps) {
  const [live, setLive] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const currentStream = useRef<MediaStream | null>(null);

  const constraints = useMemo<MediaStreamConstraints>(() => {
    // Read last selection (DeviceSelectors dispatches events too)
    const cameraId = localStorage.getItem("devices:selected:cameraId") || undefined;
    const microphoneId = localStorage.getItem("devices:selected:microphoneId") || undefined;

    return {
      video: cameraId ? { deviceId: { exact: cameraId } } : true,
      audio: microphoneId ? { deviceId: { exact: microphoneId } } : true,
    };
  }, [live]); // re-evaluate when toggling

  useEffect(() => {
    const onSelect = (e: Event) => {
      // Optionally react to live updates—but we only re-read on next start
      // const detail = (e as CustomEvent).detail;
    };
    window.addEventListener("devices:selected", onSelect as EventListener);
    return () => window.removeEventListener("devices:selected", onSelect as EventListener);
  }, []);

  async function start() {
    if (live) return;
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    currentStream.current = stream;
    setLive(true);

    window.dispatchEvent(
      new CustomEvent<StartPayload>("broadcast:start", {
        detail: { stream, constraints, room },
      })
    );
  }

  function stop() {
    if (!live) return;
    const s = currentStream.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      currentStream.current = null;
    }
    setLive(false);
    window.dispatchEvent(new CustomEvent<StopPayload>("broadcast:stop", { detail: { room } }));
  }

  function toggleDeafen() {
    const next = !deafened;
    setDeafened(next);
    // Mute/unmute all page audio (client-wide)
    document.querySelectorAll("audio, video").forEach((el) => {
      (el as HTMLMediaElement).muted = next;
    });
    window.dispatchEvent(
      new CustomEvent<DeafenPayload>("broadcast:deafen", { detail: { deafened: next, room } })
    );
  }

  return (
    <div className="w-full flex items-center gap-3 pt-2">
      {!live ? (
        <button
          className="px-4 py-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white"
          onClick={start}
        >
          Start Broadcasting
        </button>
      ) : (
        <button
          className="px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white"
          onClick={stop}
        >
          Stop Broadcasting
        </button>
      )}

      <button
        className={`px-4 py-2 rounded-2xl ${
          deafened ? "bg-red-600 hover:bg-red-700" : "bg-neutral-700 hover:bg-neutral-600"
        } text-white`}
        onClick={toggleDeafen}
      >
        {deafened ? "Undeafen" : "Deafen"}
      </button>
    </div>
  );
}
