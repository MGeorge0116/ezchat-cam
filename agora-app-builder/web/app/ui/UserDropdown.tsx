// app/ui/UserDropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        className="px-3 py-1 rounded-2xl border border-white/20 hover:bg-white/10"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-48 rounded-2xl border border-white/10 bg-black/70 backdrop-blur p-2 shadow-xl">
          <a href="/my" className="block px-3 py-2 rounded-lg hover:bg-white/10">My Room</a>
          <a href="/profile" className="block px-3 py-2 rounded-lg hover:bg-white/10">My Profile</a>
          <a href="/settings" className="block px-3 py-2 rounded-lg hover:bg-white/10">Settings</a>
        </div>
      )}
    </div>
  );
}
