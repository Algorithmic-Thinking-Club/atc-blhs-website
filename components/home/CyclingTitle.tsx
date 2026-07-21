"use client";

import { useEffect, useState } from "react";

/**
 * The hero title, typed out like a terminal. On load it types "Algorithmic
 * Thinking Club", then backspaces and types "The first computer science club at
 * BLHS", backspaces again and returns to the club name — then replays every
 * ~17s. Reduced-motion just shows the club name.
 */

const A = "Algorithmic Thinking Club";
const B = "The first computer science club at BLHS";

export default function CyclingTitle({ className = "" }: { className?: string }) {
  const [text, setText] = useState(A);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function type(str: string, speed = 55) {
      for (let i = 1; i <= str.length; i++) {
        if (cancelled) return;
        setText(str.slice(0, i));
        await sleep(speed);
      }
    }
    async function erase(str: string, speed = 26) {
      for (let i = str.length; i >= 0; i--) {
        if (cancelled) return;
        setText(str.slice(0, i));
        await sleep(speed);
      }
    }

    (async () => {
      setText("");
      await type(A); // initial type-out
      await sleep(1300);
      while (!cancelled) {
        await erase(A);
        await type(B);
        await sleep(2000);
        await erase(B);
        await type(A);
        await sleep(17000); // rest on the club name
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // colour the "BLHS" tail of phrase B in the accent as it types in
  const blhsAt = B.indexOf("BLHS");
  const splitAt = B.startsWith(text) && text.length > blhsAt ? blhsAt : text.length;
  const head = text.slice(0, splitAt);
  const tail = text.slice(splitAt);

  return (
    <span className={className}>
      {head}
      {tail && <span className="text-accent">{tail}</span>}
      <span aria-hidden className="blink text-accent">
        █
      </span>
    </span>
  );
}
