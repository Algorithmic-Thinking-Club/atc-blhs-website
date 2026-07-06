"use client";

import { useCallback, useEffect, useState } from "react";

const LINES = [
  "ATC BIOS v2.0 · Bonney Lake High School",
  "memory check ............... 32K OK",
  "loading pixel assets ....... OK",
  "reading save file 01 ....... FOUND",
  "launching ATC_OS",
];

const BOOTED_KEY = "atc-booted";

/** CRT power-on sequence. Plays once per session, click to skip. */
export default function BootScreen() {
  const [visible, setVisible] = useState(true);
  const [lineCount, setLineCount] = useState(0);
  const [fading, setFading] = useState(false);

  const finish = useCallback(() => {
    sessionStorage.setItem(BOOTED_KEY, "1");
    setVisible(false);
  }, []);

  useEffect(() => {
    if (
      sessionStorage.getItem(BOOTED_KEY) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }
    const timers: number[] = [];
    LINES.forEach((_, i) =>
      timers.push(window.setTimeout(() => setLineCount(i + 1), 200 + i * 260))
    );
    const total = 200 + LINES.length * 260;
    timers.push(window.setTimeout(() => setFading(true), total + 250));
    timers.push(window.setTimeout(finish, total + 600));
    return () => timers.forEach(clearTimeout);
  }, [finish]);

  if (!visible) return null;

  return (
    <div
      onClick={finish}
      className={`fixed inset-0 z-[100] cursor-pointer bg-[#030509] px-6 py-10 transition-opacity duration-300 sm:px-12 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden
    >
      <div className="scanlines pointer-events-none absolute inset-0" />
      <div className="space-y-1.5 font-terminal text-xl text-xp sm:text-2xl">
        {LINES.slice(0, lineCount).map((line) => (
          <p key={line}>{line}</p>
        ))}
        <span className="blink inline-block">█</span>
      </div>
      <p className="absolute bottom-6 right-6 font-pixel text-[9px] uppercase tracking-wider text-foreground/30">
        click to skip
      </p>
    </div>
  );
}
