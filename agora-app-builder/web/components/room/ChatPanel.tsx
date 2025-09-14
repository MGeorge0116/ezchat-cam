"use client";

import * as React from "react";

export interface ChatPanelProps {
  room?: string;            // accepted by RoomShell
  me?: string;              // optional; fallback to "me"
  className?: string;
  [key: string]: unknown;   // allow extra props without `any`
}

type ChatMessage = { id: string; user: string; text: string };

export default function ChatPanel({ room, me, className, ...rest }: ChatPanelProps) {
  const self = (me ?? "me").trim() || "me";
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [text, setText] = React.useState("");

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, user: self, text: t },
    ]);
    setText("");
  };

  return (
    <div
      className={`flex h-full flex-col rounded-lg border border-neutral-800 bg-neutral-900/40 ${className ?? ""}`}
      {...rest}
    >
      <header className="flex items-center justify-between border-b border-neutral-800 px-3 py-2 text-sm">
        <span className="opacity-80">Chat</span>
        <span className="text-xs opacity-60">
          {room ? (
            <>
              room: <span className="font-mono">{room}</span>
            </>
          ) : null}
          {room ? " · " : null}
          you: <span className="font-mono">{self}</span>
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="rounded-md border border-neutral-800 bg-black/20 p-3 text-center text-xs opacity-70">
            No messages yet.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="text-sm">
              <span className="font-medium">{m.user}:</span>{" "}
              <span className="opacity-90">{m.text}</span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={onSend} className="border-t border-neutral-800 p-2">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-md border border-neutral-700 bg-black/30 px-3 py-2 text-sm outline-none"
            aria-label="Chat message"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
