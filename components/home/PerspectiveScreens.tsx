"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Real ATC photos perspective-mapped into the angled monitor screens of the
 * hero scene. Each photo is warped in 3D (CSS matrix3d homography) so it sits
 * precisely inside its screen's four-corner quad, then treated as a pixel-CRT
 * image so it belongs in the pixel art.
 *
 * Quads are in the source image's 400x224 space (corner order: TL, TR, BR, BL).
 * Tune the numbers below against scripts/find_screens.py output.
 */

const IMG_W = 400;
const IMG_H = 224;

type Screen = { photo: string; quad: [number, number][] };

const SCREENS: Screen[] = [
  { photo: "/pixel/screen-nationals.png", quad: [[341, 113], [365, 115], [356, 160], [333, 152]] }, // R front
  { photo: "/pixel/screen-state.png", quad: [[35, 115], [58, 113], [66, 152], [43, 160]] }, // L front
  { photo: "/pixel/screen-stage.png", quad: [[309, 110], [323, 111], [316, 145], [303, 140]] }, // R mid
  { photo: "/pixel/screen-ceremony.png", quad: [[78, 111], [92, 110], [98, 140], [85, 145]] }, // L mid
  { photo: "/pixel/screen-booth.png", quad: [[286, 118], [294, 118], [291, 135], [283, 132]] }, // R back
  { photo: "/pixel/screen-nationals.png", quad: [[105, 109], [114, 108], [119, 132], [111, 135]] }, // L back
];

// ---- 2D projective transform (unit rect -> quad), after franklinta.com ----
type M = number[];
function adj(m: M): M {
  return [
    m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
  ];
}
function mul(a: M, b: M): M {
  const c = new Array(9).fill(0);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++) c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
  return c;
}
function mulV(m: M, v: number[]): number[] {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}
function basis(p: number[]): M {
  // p = [x1,y1, x2,y2, x3,y3, x4,y4]  (TL, TR, BL, BR)
  const m: M = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1];
  const v = mulV(adj(m), [p[6], p[7], 1]);
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
}
function matrix3d(w: number, h: number, dst: number[]): string {
  const src = [0, 0, w, 0, 0, h, w, h]; // TL, TR, BL, BR
  const t = mul(basis(dst), adj(basis(src)));
  for (let i = 0; i < 9; i++) t[i] /= t[8];
  const m = [t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]];
  return `matrix3d(${m.join(",")})`;
}
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

export default function PerspectiveScreens() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const scale = w && h ? Math.max(w / IMG_W, h / IMG_H) : 0;
  const offX = (w - IMG_W * scale) / 2;
  const offY = (h - IMG_H * scale) / 2;
  const map = (p: number[]) => [offX + p[0] * scale, offY + p[1] * scale];

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden>
      {scale > 0 &&
        SCREENS.map((s, i) => {
          const [tl, tr, br, bl] = s.quad.map(map);
          const sw = (dist(tl, tr) + dist(bl, br)) / 2;
          const sh = (dist(tl, bl) + dist(tr, br)) / 2;
          if (sw < 2 || sh < 2) return null;
          // dst order for the solver: TL, TR, BL, BR
          const dst = [tl[0], tl[1], tr[0], tr[1], bl[0], bl[1], br[0], br[1]];
          return (
            <div
              key={i}
              className="absolute left-0 top-0 overflow-hidden"
              style={{
                width: sw,
                height: sh,
                transform: matrix3d(sw, sh, dst),
                transformOrigin: "0 0",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.photo}
                alt=""
                className="pixelated h-full w-full object-cover"
                style={{ opacity: 0.92 }}
              />
              {/* CRT tint + scanlines so the photo reads as screen content */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(rgba(74,217,224,0.14), rgba(10,40,44,0.28))" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 1px, rgba(0,0,0,0.25) 1px, rgba(0,0,0,0.25) 2px)",
                }}
              />
            </div>
          );
        })}
    </div>
  );
}
