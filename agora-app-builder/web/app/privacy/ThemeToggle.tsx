// app/privacy/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";
const STORAGE_KEY = "theme";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Mode | null;
    const prefersLight =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;

    const initial: Mode = saved ?? (prefersLight ? "light" : "dark");
    setMode(initial);

    // apply
    document.documentElement.classList.remove(initial === "dark" ? "light" : "dark");
    document.documentElement.classList.add(initial);
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.classList.remove(next === "dark" ? "light" : "dark");
    document.documentElement.classList.add(next);
  }

  return (
    <button onClick={toggle} className="px-3 py-1 rounded-2xl border border-white/20 hover:bg-white/10">
      {mode === "dark" ? "Light" : "Dark"}
    </button>
  );
}
