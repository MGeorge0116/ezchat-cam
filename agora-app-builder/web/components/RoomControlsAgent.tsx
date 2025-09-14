"use client";

import * as React from "react";

/** All stage methods share this signature */
type StageMethod = () => Promise<boolean>;

/** Imperative handle RoomClient expects */
type StageHandle = {
  toggleMic: StageMethod;
  toggleCam: StageMethod;
  toggleDeafen: StageMethod;
  toggleScreen: StageMethod;
};

export type RoomControlsAgentProps = {
  /** Optional ref to the stage so we can call toggle methods */
  stageRef?: React.RefObject<StageHandle | null>;
  /**
   * Optional callback to observe local control state.
   * Only invoked when we successfully toggle something via the stageRef.
   */
  onStateChange?: (state: {
    micOn?: boolean;
    camOn?: boolean;
    deafened?: boolean;
    screenOn?: boolean;
  }) => void | Promise<void>;
  /** If you want to bind to custom selectors, override here */
  selectors?: Partial<{
    mic: string;
    cam: string;
    deafen: string;
    screen: string;
    broadcast: string; // stub, no-op
    leave: string; // stub, no-op
  }>;
  /** Allow extra props without `any` */
  [key: string]: unknown;
};

/**
 * RoomControlsAgent
 * Binds click handlers (by query selector) to call imperative methods on the stage.
 * If no matching elements exist, it safely no-ops.
 *
 * This component renders nothing; it's just glue code.
 */
export default function RoomControlsAgent({
  stageRef,
  onStateChange,
  selectors,
}: RoomControlsAgentProps) {
  React.useEffect(() => {
    // Default selectors (can be overridden via props.selectors)
    const sels = {
      mic: "[data-action='toggle-mic'], #btn-mic",
      cam: "[data-action='toggle-cam'], #btn-cam",
      deafen: "[data-action='toggle-deafen'], #btn-deafen",
      screen: "[data-action='toggle-screen'], #btn-screen",
      broadcast: "[data-action='toggle-broadcast'], #btn-broadcast",
      leave: "[data-action='leave-room'], #btn-leave",
      ...(selectors || {}),
    };

    const cleanupFns: Array<() => void> = [];

    const bindClick = (
      selector: string | undefined,
      handler: (ev: MouseEvent) => void
    ) => {
      if (!selector) return;
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      el.addEventListener("click", handler);
      cleanupFns.push(() => el.removeEventListener("click", handler));
    };

    const call = async (
      method: keyof StageHandle
    ): Promise<boolean | undefined> => {
      const refObj = stageRef?.current;
      if (!refObj) return undefined;
      const fn: StageMethod | undefined = refObj[method];
      if (typeof fn !== "function") return undefined;
      try {
        const next = await fn();
        return next;
      } catch {
        return undefined;
      }
    };

    // Mic
    bindClick(sels.mic, async (e) => {
      e.preventDefault();
      const next = await call("toggleMic");
      if (typeof next === "boolean") void onStateChange?.({ micOn: next });
    });

    // Cam
    bindClick(sels.cam, async (e) => {
      e.preventDefault();
      const next = await call("toggleCam");
      if (typeof next === "boolean") void onStateChange?.({ camOn: next });
    });

    // Deafen
    bindClick(sels.deafen, async (e) => {
      e.preventDefault();
      const next = await call("toggleDeafen");
      if (typeof next === "boolean") void onStateChange?.({ deafened: next });
    });

    // Screen share
    bindClick(sels.screen, async (e) => {
      e.preventDefault();
      const next = await call("toggleScreen");
      if (typeof next === "boolean") void onStateChange?.({ screenOn: next });
    });

    // Broadcast (no-op stub, left for future wiring)
    bindClick(sels.broadcast, (e) => {
      e.preventDefault();
      // Integrate with your broadcast service here.
    });

    // Leave (no-op stub, left for future wiring)
    bindClick(sels.leave, (e) => {
      e.preventDefault();
      // Navigate away or call your leaveRoom() here.
    });

    // Cleanup all listeners on unmount or when deps change
    return () => {
      for (const fn of cleanupFns) fn();
    };
    // We only depend on selectors and the ref identity; the handlers are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageRef, selectors, onStateChange]);

  return null;
}
