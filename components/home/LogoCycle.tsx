"use client";

import { useEffect, useRef } from "react";

/**
 * The ATC logo pixelates out, morphs into the SkillsUSA logo (pixelated, then
 * crisp), holds, then reverses back to the ATC logo. Loops every 15 seconds.
 * A clean pixelation cross-morph between the two real logos — no particles.
 * Reduced-motion: static ATC logo.
 */

const CW = 240;
const CH = 150;
const MAXL = 5; // peak pixelation level

// phase boundaries (seconds); a short loop so it reads as alive. Each morph is
// a simultaneous cross-dissolve + pixel bump (smoother than a hard swap).
const S = {
  startHold: 0.3,
  morphA: 1.45, // ATC -> SkillsUSA
  skillsHold: 2.6, // SkillsUSA crisp
  morphB: 3.75, // SkillsUSA -> ATC
  cycle: 5.6, // then ~1.85s rest on ATC
};

// easeInOutCubic — smoother than quad
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function LogoCycle({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = CW * dpr;
    canvas.height = CH * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    const off = document.createElement("canvas");
    off.width = CW;
    off.height = CH;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.imageSmoothingEnabled = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const atc = new Image();
    const skills = new Image();

    function contain(img: HTMLImageElement) {
      const s = Math.min((CW * 0.96) / img.width, (CH * 0.96) / img.height);
      const w = img.width * s;
      const h = img.height * s;
      return { x: (CW - w) / 2, y: (CH - h) / 2, w, h };
    }
    function drawPix(img: HTMLImageElement, level: number, alpha: number, glow: string) {
      const r = contain(img);
      const sw = Math.max(2, Math.round(r.w / level));
      const sh = Math.max(2, Math.round(r.h / level));
      octx!.clearRect(0, 0, CW, CH);
      octx!.drawImage(img, 0, 0, sw, sh);
      ctx!.globalAlpha = alpha;
      const blur = Math.max(0, 2.6 - level) * 6; // soft glow as it resolves
      if (blur > 0) {
        ctx!.shadowColor = glow;
        ctx!.shadowBlur = blur;
      }
      ctx!.drawImage(off, 0, 0, sw, sh, r.x, r.y, r.w, r.h);
      ctx!.shadowBlur = 0;
      ctx!.globalAlpha = 1;
    }

    const TEAL = "#4ad9e0";
    const WHITE = "#cfe8ea";

    // a morph: both logos cross-dissolve while pixelation bumps up then back down
    function morph(from: HTMLImageElement, fromGlow: string, to: HTMLImageElement, toGlow: string, p: number) {
      const e = ease(p);
      const lvl = 1 + Math.sin(e * Math.PI) * (MAXL - 1);
      drawPix(from, lvl, 1 - e, fromGlow);
      drawPix(to, lvl, e, toGlow);
    }

    function render(tc: number) {
      ctx!.clearRect(0, 0, CW, CH);
      if (tc < S.startHold) {
        drawPix(atc, 1, 1, TEAL);
      } else if (tc < S.morphA) {
        morph(atc, TEAL, skills, WHITE, (tc - S.startHold) / (S.morphA - S.startHold));
      } else if (tc < S.skillsHold) {
        drawPix(skills, 1, 1, WHITE);
      } else if (tc < S.morphB) {
        morph(skills, WHITE, atc, TEAL, (tc - S.skillsHold) / (S.morphB - S.skillsHold));
      } else {
        drawPix(atc, 1, 1, TEAL);
      }
    }

    let raf = 0;
    let start = 0;
    let started = false;
    function frame(ts: number) {
      if (!start) start = ts;
      // never let a transient error stop the loop
      try {
        render(((ts - start) / 1000) % S.cycle);
      } catch {
        /* skip this frame */
      }
      raf = requestAnimationFrame(frame);
    }
    const freeze = new URLSearchParams(window.location.search).get("logot");
    function begin() {
      if (started) return;
      started = true;
      if (freeze !== null) {
        render(parseFloat(freeze));
        return;
      }
      if (reduced) {
        drawPix(atc, 1, 1, TEAL);
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    let loaded = 0;
    const go = () => {
      if (++loaded >= 2) begin();
    };
    atc.onload = go;
    atc.onerror = go;
    skills.onload = go;
    skills.onerror = go;
    atc.src = "/logo.png";
    skills.src = "/skillsusa-logo-light.png";
    if (atc.complete) go();
    if (skills.complete) go();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ width: CW, height: CH }}
      className={className}
      aria-label="ATC"
      role="img"
    />
  );
}
