// lib/browser.ts
// Utilities to prevent server/SSG from touching browser APIs.

export const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

export function getUserMediaSafe(constraints: MediaStreamConstraints) {
  if (!isBrowser() || !navigator.mediaDevices?.getUserMedia) {
    throw new Error("getUserMedia not available in this environment");
  }
  return navigator.mediaDevices.getUserMedia(constraints);
}

export function enumerateDevicesSafe() {
  if (!isBrowser() || !navigator.mediaDevices?.enumerateDevices) {
    throw new Error("enumerateDevices not available in this environment");
  }
  return navigator.mediaDevices.enumerateDevices();
}

export function playMediaSafely(el: HTMLMediaElement | null | undefined) {
  if (!isBrowser() || !el?.play) return;
  void el.play();
}
