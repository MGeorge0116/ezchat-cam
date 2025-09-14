// app/theme/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    // read initial preference (safe in client)
    const stored = (localStorage.getItem("theme") as Mode | null);
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial: Mode = stored ?? (prefersDark ? "dark" : "light");
    setMode(initial);

    const root = document.documentElement;
    root.classList.remove(initial === "dark" ? "light" : "dark");
    root.classList.add(initial);
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem("theme", next);
    const root = document.documentElement;
    root.classList.remove(next === "dark" ? "light" : "dark");
    root.classList.add(next);
  }

  return (
    <button onClick={toggle} className="px-3 py-1 rounded-2xl border border-white/20 hover:bg-white/10">
      {mode === "dark" ? "Switch to Light" : "Switch to Dark"}
    </button>
  );
}
