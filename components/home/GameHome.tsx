"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import BootScreen from "@/components/home/BootScreen";
import LogoCycle from "@/components/home/LogoCycle";
import CyclingTitle from "@/components/home/CyclingTitle";
import PerspectiveScreens from "@/components/home/PerspectiveScreens";
import Sprite from "@/components/fx/Sprite";
import Typewriter from "@/components/fx/Typewriter";
import Reveal from "@/components/fx/Reveal";
import { memberYears } from "@/data/members";

const MENU = [
  {
    label: "Join the Club",
    sub: "new members start here",
    href: "/join",
    line: "Sign up, then show up. The first meeting is basically the tutorial.",
  },
  {
    label: "Member Hub",
    sub: "chat & announcements",
    href: "/hub",
    line: "Already a member? Pick up where you left off in the hub.",
  },
  {
    label: "Projects",
    sub: "what we build",
    href: "/projects",
    line: "Everything we're building, including the site you're looking at.",
  },
  {
    label: "Competitions",
    sub: "SkillsUSA results",
    href: "/competitions",
    line: "How the SkillsUSA season went. Short version: medals at state, then nationals in Atlanta.",
  },
  {
    label: "Members",
    sub: "the team",
    href: "/members",
    line: "Meet the members. One of them has sworn eternal war on the CollegeBoard.",
  },
];

const SAVE_LINES: React.ReactNode[] = [
  <>
    Shipped{" "}
    <a
      href="https://wisegraph.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline-offset-2 hover:underline hover:crt-glow"
    >
      WiseGraph
    </a>
    , a progress tracker a BLHS support specialist uses in real meetings
  </>,
  "Took 1st, 2nd, and 3rd at SkillsUSA regionals in computer programming",
  "Won gold and bronze at state, then competed at nationals in Atlanta",
];

const PHOTOS = [
  {
    src: "/skillsusa-ceremony.jpg",
    alt: "SkillsUSA state medal ceremony",
    cap: "state medal ceremony",
  },
  {
    src: "/nationals.jpg",
    alt: "ATC members outside the SkillsUSA national conference in Atlanta",
    cap: "nationals, atlanta",
  },
  {
    src: "/club-booth.jpg",
    alt: "ATC booth at the BLHS club fair",
    cap: "club fair booth, fall 2025",
  },
];

// fixed positions so server and client render the same dust
const DUST = [
  { left: "8%", top: "18%", d: 0 },
  { left: "16%", top: "62%", d: 0.9 },
  { left: "24%", top: "34%", d: 1.7 },
  { left: "37%", top: "12%", d: 0.4 },
  { left: "46%", top: "72%", d: 2.1 },
  { left: "58%", top: "26%", d: 1.2 },
  { left: "67%", top: "58%", d: 0.2 },
  { left: "74%", top: "15%", d: 1.5 },
  { left: "83%", top: "44%", d: 0.7 },
  { left: "91%", top: "68%", d: 1.9 },
  { left: "31%", top: "82%", d: 1.1 },
  { left: "62%", top: "86%", d: 0.5 },
];

export default function GameHome() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [started, setStarted] = useState(false);
  const [wiping, setWiping] = useState(false);

  const partySize = memberYears[0].members.length;

  // mouse parallax on the title screen
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 14 });
  const sy = useSpring(my, { stiffness: 50, damping: 14 });
  const sceneX = useTransform(sx, (v) => v * -16);
  const sceneY = useTransform(sy, (v) => v * -9);
  const frontX = useTransform(sx, (v) => v * 10);
  const frontY = useTransform(sy, (v) => v * 6);

  function navigateWithWipe(href: string) {
    if (wiping) return;
    setWiping(true);
    setTimeout(() => router.push(href), 420);
  }

  // arrow-key + enter navigation, like a real title menu
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setStarted(true);
        setSelected((s) => (s + 1) % MENU.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setStarted(true);
        setSelected((s) => (s - 1 + MENU.length) % MENU.length);
      } else if (e.key === "Enter" && started) {
        navigateWithWipe(MENU[selected].href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, started, wiping]);

  function pressStart() {
    setStarted(true);
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <BootScreen />

      {/* screen wipe when a menu item is chosen */}
      {wiping && (
        <div className="screen-wipe fixed inset-0 z-[90] bg-[#030509]" aria-hidden />
      )}

      {/* ---- title screen ---- */}
      <section
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        className="vignette relative flex min-h-[calc(100dvh-65px)] flex-col items-center justify-center overflow-hidden px-6"
      >
        <motion.div
          className="absolute -inset-6"
          style={{ x: sceneX, y: sceneY }}
        >
          <Image
            src="/pixel/hero-scene.png"
            alt=""
            fill
            sizes="100vw"
            className="pixelated object-cover"
            priority
          />
          <div className="absolute inset-0 bg-background/55" />
          {/* real ATC photos mapped into the angled monitor screens */}
          <PerspectiveScreens />
        </motion.div>
        <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />

        {/* drifting pixel dust */}
        {DUST.map((p, i) => (
          <span
            key={i}
            aria-hidden
            className="twinkle pointer-events-none absolute z-10 h-1 w-1"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: `${p.d}s`,
              backgroundColor: i % 3 === 0 ? "var(--gold)" : "var(--teal)",
              opacity: 0.7,
            }}
          />
        ))}

        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          style={{ x: frontX, y: frontY }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LogoCycle className="float" />
          </motion.div>
          <p className="mt-8 font-pixel text-[11px] uppercase tracking-[0.3em] text-accent crt-glow">
            Bonney Lake High School
          </p>
          <h1 className="glitch mt-5 min-h-[4.5rem] max-w-xl font-pixel text-3xl uppercase leading-tight tracking-wide sm:min-h-[7.5rem] sm:text-5xl">
            <CyclingTitle />
          </h1>

          <button
            onClick={pressStart}
            className="blink mt-12 font-pixel text-sm uppercase tracking-[0.25em] text-foreground transition-colors hover:text-accent"
          >
            ▸ Press Start ◂
          </button>
          <p className="mt-6 font-terminal text-lg text-foreground/40">
            © 2025 ATC · BLHS
          </p>
        </motion.div>

        <button
          onClick={pressStart}
          aria-label="Scroll to menu"
          className="absolute bottom-6 right-8 z-10 font-pixel text-accent"
        >
          <span className="blink inline-block">▼</span>
        </button>
      </section>

      {/* ---- main menu ---- */}
      <section
        ref={menuRef}
        className="px-grid relative border-t-2 border-line bg-background"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:gap-16 md:py-28">
          {/* menu list */}
          <nav aria-label="Main menu">
            <p className="mb-6 font-pixel text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              Main menu
            </p>
            <ul className="space-y-1">
              {MENU.map((item, i) => {
                const active = i === selected;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateWithWipe(item.href);
                      }}
                      onMouseEnter={() => {
                        setStarted(true);
                        setSelected(i);
                      }}
                      onFocus={() => {
                        setStarted(true);
                        setSelected(i);
                      }}
                      className={`flex items-baseline gap-3 px-3 py-3 transition-colors ${
                        active ? "bg-panel" : ""
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`menu-cursor font-pixel text-sm text-accent ${active ? "opacity-100" : "opacity-0"}`}
                      >
                        ▸
                      </span>
                      <span
                        className={`font-pixel text-sm uppercase tracking-wider ${
                          active ? "text-accent crt-glow" : "text-foreground/60"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="font-terminal text-base text-foreground/35">
                        {item.sub}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 hidden font-terminal text-lg text-foreground/30 md:block">
              ↑↓ to browse · enter to select
            </p>
          </nav>

          {/* mascot + dialog box */}
          <div className="flex flex-col justify-center">
            <div className="flex items-end gap-4">
              <Sprite
                sheet="/pixel/mascot-idle-sheet.png"
                frames={4}
                size={104}
                label="Thor, the Adventure Game hero"
                className="shrink-0"
              />
              <div className="pixel-border pixel-border-accent min-h-[120px] flex-1 bg-panel p-5">
                <p className="font-pixel text-[10px] uppercase tracking-wider text-accent">
                  THOR
                </p>
                <p className="mt-2 font-terminal text-xl leading-snug text-foreground/80">
                  <Typewriter
                    key={selected}
                    text={MENU[selected].line}
                    speed={18}
                    keepCursor={false}
                  />
                </p>
              </div>
            </div>

            {/* status bar, like the top of a game screen */}
            <div className="pixel-border mt-10 flex flex-wrap items-stretch bg-panel font-terminal text-xl leading-none">
              <span className="flex items-center border-r-2 border-line px-4 py-3 text-gold gold-glow">
                LV.2
              </span>
              <span className="flex items-center gap-2 border-r-2 border-line px-4 py-3 text-foreground/75">
                <Image
                  src="/pixel/ui-coin.png"
                  alt=""
                  width={18}
                  height={18}
                  className="pixelated"
                />
                {partySize}
                <span className="text-foreground/40">party</span>
              </span>
              <span className="flex items-center gap-2 px-4 py-3 text-foreground/75">
                <Image
                  src="/pixel/badge-trophy.png"
                  alt=""
                  width={20}
                  height={20}
                  className="pixelated"
                />
                3
                <span className="text-foreground/40">trophies</span>
              </span>
              <span className="ml-auto flex items-center gap-1.5 border-l-2 border-line px-4 py-3 text-accent">
                <span aria-hidden className="menu-cursor">
                  ▸
                </span>
                next up: 2026-27
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- last save + memory card ---- */}
      <section className="px-grid border-t-2 border-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <div className="pixel-border mx-auto max-w-3xl bg-panel p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="font-pixel text-xs uppercase tracking-wider text-accent">
                  Year One
                </p>
                <p className="font-terminal text-lg text-foreground/40">
                  2025-26
                </p>
              </div>
              <p className="mt-4 font-terminal text-xl leading-snug text-foreground/80">
                ATC is the <span className="text-accent">first</span> computer
                science club at Bonney Lake High School.
              </p>
              <ul className="mt-6 space-y-4">
                {SAVE_LINES.map((line, i) => (
                  <Reveal key={i} delay={0.15 + i * 0.12} from="left">
                    <li className="flex gap-3 font-terminal text-xl leading-snug text-foreground/70">
                      <span aria-hidden className="shrink-0 text-gold">
                        ★
                      </span>
                      <span>{line}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t-2 border-line pt-6">
                <p className="font-terminal text-lg text-foreground/40">
                  Year two starts October 2026, with plenty of room to grow.
                </p>
                <Link
                  href="/join"
                  className="font-pixel text-xs uppercase tracking-wider text-accent hover:crt-glow"
                >
                  ▸ Join us
                </Link>
              </div>
            </div>
          </Reveal>

          {/* memory card: real photos, framed like save data */}
          <div className="mx-auto mt-14 max-w-4xl">
            <Reveal>
              <p className="flex items-center gap-3 font-pixel text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                <Image
                  src="/pixel/ui-star.png"
                  alt=""
                  width={14}
                  height={14}
                  className="pixelated"
                />
                Photos
              </p>
            </Reveal>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {PHOTOS.map((photo, i) => (
                <Reveal key={photo.src} delay={i * 0.12}>
                  <figure className="group pixel-border overflow-hidden bg-panel">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover object-[50%_42%] transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="scanlines absolute inset-0" aria-hidden />
                    </div>
                    <figcaption className="px-3 py-2.5 font-terminal text-base text-foreground/50">
                      {photo.cap}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
