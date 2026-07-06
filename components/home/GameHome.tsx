"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Sprite from "@/components/fx/Sprite";
import Typewriter from "@/components/fx/Typewriter";
import Reveal from "@/components/fx/Reveal";
import { memberYears } from "@/data/members";

const MENU = [
  {
    label: "New Game",
    href: "/join",
    line: "Join ATC. Your first meeting counts as the tutorial.",
  },
  {
    label: "Continue",
    href: "/hub",
    line: "Already in the club? The hub has chat, notes, and announcements.",
  },
  {
    label: "Quest Log",
    href: "/projects",
    line: "WiseGraph, this website, and the Adventure Game we're building next.",
  },
  {
    label: "Trophy Room",
    href: "/competitions",
    line: "SkillsUSA: a regional podium sweep, state gold, and a trip to nationals.",
  },
  {
    label: "Party",
    href: "/members",
    line: "The people. Knights, wizards, and one warrior sworn against the CollegeBoard.",
  },
];

const SAVE_LINES = [
  "Shipped WiseGraph, a progress tracker a BLHS support specialist uses for real meetings",
  "Took 1st, 2nd, and 3rd at SkillsUSA regionals in computer programming",
  "Won state gold and qualified for nationals in Atlanta",
];

export default function GameHome() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [started, setStarted] = useState(false);

  const partySize = memberYears[0].members.length;

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
        router.push(MENU[selected].href);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, selected, started]);

  function pressStart() {
    setStarted(true);
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* ---- title screen ---- */}
      <section className="relative flex min-h-[calc(100dvh-65px)] flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0">
          <Image
            src="/pixel/hero-scene.png"
            alt=""
            fill
            className="pixelated object-cover"
            priority
          />
          <div className="absolute inset-0 bg-background/55" />
        </div>
        <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/logo.png"
              alt="ATC logo"
              width={120}
              height={120}
              priority
              className="float"
            />
          </motion.div>
          <p className="mt-8 font-pixel text-[11px] uppercase tracking-[0.3em] text-accent crt-glow">
            Bonney Lake High School
          </p>
          <h1 className="glitch mt-4 max-w-3xl font-pixel text-3xl uppercase leading-relaxed tracking-wide sm:text-5xl sm:leading-relaxed">
            Algorithmic
            <br />
            Thinking Club
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
        </div>

        <button
          onClick={pressStart}
          aria-label="Scroll to menu"
          className="absolute bottom-6 z-10 font-pixel text-accent"
        >
          <span className="blink inline-block">▼</span>
        </button>
      </section>

      {/* ---- main menu ---- */}
      <section
        ref={menuRef}
        className="relative border-t-2 border-line bg-background"
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
                      onMouseEnter={() => {
                        setStarted(true);
                        setSelected(i);
                      }}
                      onFocus={() => {
                        setStarted(true);
                        setSelected(i);
                      }}
                      className={`flex items-center gap-3 px-3 py-3 font-pixel text-sm uppercase tracking-wider transition-colors ${
                        active
                          ? "bg-panel text-accent crt-glow"
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`menu-cursor text-accent ${active ? "opacity-100" : "opacity-0"}`}
                      >
                        ▸
                      </span>
                      {item.label}
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
                size={96}
                label="ATC robot mascot"
                className="shrink-0"
              />
              <div className="pixel-border pixel-border-accent min-h-[120px] flex-1 bg-panel p-5">
                <p className="font-pixel text-[10px] uppercase tracking-wider text-accent">
                  BYTE
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

            {/* HUD strip */}
            <div className="mt-10 grid grid-cols-2 gap-px border-2 border-line bg-line sm:grid-cols-4">
              {[
                { k: "Year", v: "02" },
                { k: "Party", v: String(partySize) },
                { k: "Trophies", v: "03" },
                { k: "Next stop", v: "Atlanta" },
              ].map((stat) => (
                <div key={stat.k} className="bg-panel px-4 py-3">
                  <p className="font-pixel text-[9px] uppercase tracking-wider text-foreground/40">
                    {stat.k}
                  </p>
                  <p className="mt-1 font-pixel text-base text-gold">{stat.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- last save ---- */}
      <section className="border-t-2 border-line bg-panel/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <div className="pixel-border mx-auto max-w-3xl bg-panel p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="font-pixel text-xs uppercase tracking-wider text-accent">
                  Save file 01: year one
                </p>
                <p className="font-terminal text-lg text-foreground/40">
                  2025-26
                </p>
              </div>
              <ul className="mt-6 space-y-4">
                {SAVE_LINES.map((line, i) => (
                  <Reveal key={line} delay={0.15 + i * 0.12} from="left">
                    <li className="flex gap-3 font-terminal text-xl leading-snug text-foreground/70">
                      <span aria-hidden className="text-gold">
                        ★
                      </span>
                      {line}
                    </li>
                  </Reveal>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t-2 border-line pt-6">
                <p className="font-terminal text-lg text-foreground/40">
                  Year two starts October 2026. The save file has room.
                </p>
                <Link
                  href="/join"
                  className="font-pixel text-xs uppercase tracking-wider text-accent hover:crt-glow"
                >
                  ▸ Continue
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
