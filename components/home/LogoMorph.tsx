"use client";

import { useEffect, useRef } from "react";

/**
 * The ATC logo, continuously melting between its crisp form and a pixelated
 * one and back — a seamless "de-resolving" pulse rendered on a canvas.
 * Falls back to the crisp logo for reduced-motion.
 */
export default function LogoMorph({
  src = "/logo.png",
  size = 120,
  className = "",
}: {
  src?: string;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    off.width = size;
    off.height = size;
    const octx = off.getContext("2d");
    if (!octx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    img.src = src;

    let raf = 0;
    let start = 0;

    function drawAt(level: number) {
      const small = Math.max(2, Math.round(size / level));
      octx!.clearRect(0, 0, size, size);
      octx!.imageSmoothingEnabled = true;
      octx!.drawImage(img, 0, 0, small, small);
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx!.imageSmoothingEnabled = false;
      ctx!.drawImage(off, 0, 0, small, small, 0, 0, canvas!.width, canvas!.height);
    }

    function frame(ts: number) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      // crisp at the ends of the cycle, pixelated in the middle — molds back and forth
      const period = 5.2;
      const ph = (t % period) / period;
      let a = Math.sin(ph * Math.PI); // 0 -> 1 -> 0
      a = Math.pow(Math.max(0, a), 1.5);
      const level = 1 + a * 6; // peak stays a recognizable pixelated mark, not a blob
      drawAt(level);
      raf = requestAnimationFrame(frame);
    }

    img.onload = () => {
      if (reduced) {
        drawAt(1);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    return () => cancelAnimationFrame(raf);
  }, [src, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={className}
      aria-label="ATC logo"
      role="img"
    />
  );
}
