"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  /** ms per character */
  speed?: number;
  /** ms before typing starts */
  startDelay?: number;
  className?: string;
  /** keep the block cursor blinking after finishing */
  keepCursor?: boolean;
};

export default function Typewriter({
  text,
  speed = 45,
  startDelay = 0,
  className = "",
  keepCursor = true,
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    setCount(0);
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      {(!done || keepCursor) && (
        <span aria-hidden className="blink text-accent">
          █
        </span>
      )}
    </span>
  );
}
