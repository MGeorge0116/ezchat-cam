"use client";

import { useRef } from "react";
import { getUserMediaSafe } from "@/lib/browser";

export default function Publisher() {
  const clientRef = useRef<any>(null);
  const localTrackRef = useRef<any>(null);

  async function start(channel: string, token: string, appId: string) {
    // ✅ dynamically import only in the browser
    const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;

    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    await client.join(appId, channel, token, null);

    const stream = await getUserMediaSafe({ video: true, audio: true });
    const [videoTrack] = await AgoraRTC.createCameraVideoTrack();
    localTrackRef.current = videoTrack;
    await client.publish([videoTrack]);
  }

  async function stop() {
    const client = clientRef.current;
    if (!client) return;
    const track = localTrackRef.current;
    if (track) track.stop();
    await client.unpublish();
    await client.leave();
    clientRef.current = null;
    localTrackRef.current = null;
  }

  return null; // render your UI elsewhere; keep this logic here
}
