// components/DeviceSelectors.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type MediaDevice = Pick<MediaDeviceInfo, "deviceId" | "label" | "kind">;

const LS_KEYS = {
  cam: "devices:selected:cameraId",
  mic: "devices:selected:microphoneId",
};

export default function DeviceSelectors() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [cam, setCam] = useState<string | undefined>(undefined);
  const [mic, setMic] = useState<string | undefined>(undefined);
  const [ready, setReady] = useState(false);

  // Request permission once to get labels
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const storedCam = localStorage.getItem(LS_KEYS.cam) || undefined;
        const storedMic = localStorage.getItem(LS_KEYS.mic) || undefined;
        setCam(storedCam);
        setMic(storedMic);

        // Ask browser permission one time if needed
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((s) => {
          // Immediately stop to avoid blinking LED before user starts broadcast
          s.getTracks().forEach((t) => t.stop());
        });

        const list = await navigator.mediaDevices.enumerateDevices();
        if (!cancelled) {
          setDevices(list);
          setReady(true);
        }
      } catch (e) {
        console.error("Device permission/enumeration failed", e);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const cams = useMemo(
    () => devices.filter((d) => d.kind === "videoinput"),
    [devices]
  );
  const mics = useMemo(
    () => devices.filter((d) => d.kind === "audioinput"),
    [devices]
  );

  function dispatchSelection(nextCam?: string, nextMic?: string) {
    const detail = { cameraId: nextCam, microphoneId: nextMic };
    window.dispatchEvent(new CustomEvent("devices:selected", { detail }));
  }

  function onCamChange(id: string) {
    setCam(id);
    if (id) localStorage.setItem(LS_KEYS.cam, id);
    dispatchSelection(id, mic);
  }

  function onMicChange(id: string) {
    setMic(id);
    if (id) localStorage.setItem(LS_KEYS.mic, id);
    dispatchSelection(cam, id);
  }

  useEffect(() => {
    // On first ready, emit whatever we have
    if (ready) {
      dispatchSelection(cam, mic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div className="w-full flex items-center gap-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm opacity-80">Camera</span>
        <select
          className="bg-transparent border border-white/20 rounded-xl px-2 py-1"
          value={cam ?? ""}
          onChange={(e) => onCamChange(e.target.value)}
        >
          <option value="">Auto</option>
          {cams.map((c, i) => (
            <option key={c.deviceId || `cam-${i}`} value={c.deviceId}>
              {c.label || `Camera ${i + 1}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm opacity-80">Microphone</span>
        <select
          className="bg-transparent border border-white/20 rounded-xl px-2 py-1"
          value={mic ?? ""}
          onChange={(e) => onMicChange(e.target.value)}
        >
          <option value="">Auto</option>
          {mics.map((m, i) => (
            <option key={m.deviceId || `mic-${i}`} value={m.deviceId}>
              {m.label || `Microphone ${i + 1}`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
