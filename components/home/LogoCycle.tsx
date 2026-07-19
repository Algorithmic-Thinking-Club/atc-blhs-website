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
const MAXL = 6; // peak pixelation level

// phase boundaries (seconds) within a 15s cycle
const S = {
  atcPix: 0.6,
  toSkills: 1.55,
  skillsCrisp: 1.85,
  skillsHold: 2.7,
  skillsPix: 3.9,
  toAtc: 4.85,
  atcCrisp: 5.15,
  done: 6.0,
  cycle: 15,
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
    const pl = (a: number, b: number, tc: number) => (tc - a) / (b - a); // phase-local

    function render(tc: number) {
      ctx!.clearRect(0, 0, CW, CH);
      if (tc < S.atcPix) {
        drawPix(atc, 1, 1, TEAL);
      } else if (tc < S.toSkills) {
        drawPix(atc, 1 + ease(pl(S.atcPix, S.toSkills, tc)) * (MAXL - 1), 1, TEAL);
      } else if (tc < S.skillsCrisp) {
        const u = ease(pl(S.toSkills, S.skillsCrisp, tc));
        drawPix(atc, MAXL, 1 - u, TEAL);
        drawPix(skills, MAXL, u, WHITE);
      } else if (tc < S.skillsHold) {
        drawPix(skills, MAXL - ease(pl(S.skillsCrisp, S.skillsHold, tc)) * (MAXL - 1), 1, WHITE);
      } else if (tc < S.skillsPix) {
        drawPix(skills, 1, 1, WHITE);
      } else if (tc < S.toAtc) {
        drawPix(skills, 1 + ease(pl(S.skillsPix, S.toAtc, tc)) * (MAXL - 1), 1, WHITE);
      } else if (tc < S.atcCrisp) {
        const u = ease(pl(S.toAtc, S.atcCrisp, tc));
        drawPix(skills, MAXL, 1 - u, WHITE);
        drawPix(atc, MAXL, u, TEAL);
      } else if (tc < S.done) {
        drawPix(atc, MAXL - ease(pl(S.atcCrisp, S.done, tc)) * (MAXL - 1), 1, TEAL);
      } else {
        drawPix(atc, 1, 1, TEAL);
      }
    }

    let raf = 0;
    let start = 0;
    let started = false;
    function frame(ts: number) {
      if (!start) start = ts;
      render(((ts - start) / 1000) % S.cycle);
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
