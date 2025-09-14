// Minimal ambient types to unblock TypeScript if the SDK isn't installed yet.
// If you install the real SDK (`npm i -E agora-rtc-sdk-ng`), this file is harmless.

declare module "agora-rtc-sdk-ng" {
  export type IAgoraRTCClient = unknown;
  export type IAgoraRTCRemoteUser = {
    uid?: string | number;
    [k: string]: unknown;
  };
  const _default: any;
  export default _default;
}
