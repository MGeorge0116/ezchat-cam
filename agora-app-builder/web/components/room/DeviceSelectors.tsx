"use client";

import * as React from "react";

export interface DeviceSelectorsProps {
  room?: string; // accepted for callers like <DeviceSelectors room={...} />
  className?: string;
  selectedMicId?: string;
  selectedCamId?: string;
  onChangeMic?: (deviceId: string) => void | Promise<void>;
  onChangeCam?: (deviceId: string) => void | Promise<void>;
  [key: string]: unknown; // allow extra props without `any`
}

type MediaDevice = { deviceId: string; label: string };

export default function DeviceSelectors({
  room, // not used but accepted to satisfy caller
  className,
  selectedMicId,
  selectedCamId,
  onChangeMic,
  onChangeCam,
  ...rest
}: DeviceSelectorsProps) {
  const [mics, setMics] = React.useState<MediaDevice[]>([]);
  const [cams, setCams] = React.useState<MediaDevice[]>([]);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!navigator?.mediaDevices?.enumerateDevices) return;
      const list = await navigator.mediaDevices.enumerateDevices();
      if (!mounted) return;
      setMics(
        list
          .filter((d) => d.kind === "audioinput")
          .map((d) => ({ deviceId: d.deviceId, label: d.label || "Microphone" }))
      );
      setCams(
        list
          .filter((d) => d.kind === "videoinput")
          .map((d) => ({ deviceId: d.deviceId, label: d.label || "Camera" }))
      );
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const onMic = (e: React.ChangeEvent<HTMLSelectElement>) =>
    void onChangeMic?.(e.target.value);
  const onCam = (e: React.ChangeEvent<HTMLSelectElement>) =>
    void onChangeCam?.(e.target.value);

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 ${className ?? ""}`}
      {...rest}
    >
      <label className="flex items-center gap-2 text-sm">
        <span className="opacity-80">Mic</span>
        <select
          value={selectedMicId ?? ""}
          onChange={onMic}
          className="rounded-md border border-neutral-700 bg-black/30 px-2 py-1 text-sm"
          aria-label="Select microphone"
        >
          <option value="">System default</option>
          {mics.map((m) => (
            <option key={m.deviceId} value={m.deviceId}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <span className="opacity-80">Camera</span>
        <select
          value={selectedCamId ?? ""}
          onChange={onCam}
          className="rounded-md border border-neutral-700 bg-black/30 px-2 py-1 text-sm"
          aria-label="Select camera"
        >
          <option value="">System default</option>
          {cams.map((c) => (
            <option key={c.deviceId} value={c.deviceId}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      {room ? (
        <span className="ml-auto text-xs opacity-60">
          room: <span className="font-mono">{room}</span>
        </span>
      ) : null}
    </div>
  );
}
