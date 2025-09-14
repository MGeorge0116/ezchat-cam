// Utility helpers for browser MessageEvent handling (SSE, WebSocket, postMessage)

export type MessageHandler<T> = (data: T, ev: MessageEvent<unknown>) => void;

export type MessageOptions = {
  /** If true (default), try to JSON.parse string payloads before handing off */
  useJson?: boolean;
};

/** Parse strings as JSON when possible; otherwise return the original input */
export function parseMaybeJson(input: unknown): unknown {
  if (typeof input !== "string") return input;
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
}

/**
 * Factory returning a `(ev: MessageEvent) => void` that forwards `ev.data`
 * to your typed handler. When `useJson` is true (default), it attempts to
 * JSON.parse string payloads before invoking the handler.
 */
function makeFactory<T>(
  handler: MessageHandler<T>,
  opts?: MessageOptions
): (ev: MessageEvent<unknown>) => void {
  const useJson = opts?.useJson !== false; // default true
  return (ev: MessageEvent<unknown>) => {
    const payload = useJson ? parseMaybeJson(ev.data) : (ev.data as unknown);
    handler(payload as T, ev);
  };
}

/** Primary export */
export const makeMessageHandler = makeFactory;

/** Common aliases (use whichever name your code expects) */
export const createMessageHandler = makeFactory;
export const makeOnMessage = makeFactory;
export const createOnMessage = makeFactory;

/**
 * Convenience: attach a message listener to an EventTarget (e.g., EventSource or WebSocket)
 * Returns an unsubscribe function.
 */
export function addOnMessage<T>(
  target: EventTarget,
  handler: MessageHandler<T>,
  opts?: MessageOptions
): () => void {
  const listener = makeFactory<T>(handler, opts) as unknown as EventListener;
  target.addEventListener("message", listener);
  return () => target.removeEventListener("message", listener);
}
