import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Sprite from "@/components/fx/Sprite";
import Typewriter from "@/components/fx/Typewriter";
import Reveal from "@/components/fx/Reveal";

export const metadata: Metadata = {
  title: "Join",
};

const loot = [
  {
    title: "Real projects",
    description: (
      <>
        We make software people actually use.{" "}
        <a
          href="https://wisegraph.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline-offset-2 hover:underline hover:crt-glow"
        >
          WiseGraph
        </a>{" "}
        runs at BLHS right now.
      </>
    ),
  },
  {
    title: "Competitions",
    description:
      "SkillsUSA takes us from regionals to nationals. Last year we took gold and bronze at state and competed at nationals in Atlanta.",
  },
  {
    title: "Learn by building",
    description:
      "Nobody lectures you here. You pick something to build and we help you build it.",
  },
  {
    title: "Any skill level",
    description:
      "Total beginner is fine. If you already code, you get to lead something.",
  },
  {
    title: "Student-led",
    description: "Students run the club and decide what we build next.",
  },
  {
    title: "Proof of work",
    description:
      "Everything here is real work you can point to on college apps and GitHub.",
  },
];

export default function JoinPage() {
  return (
    <>
      <div className="relative flex flex-col lg:min-h-[70vh] lg:flex-row">
        {/* text side */}
        <div className="flex-1 px-6 py-16 sm:px-12 sm:py-20 lg:flex lg:items-center">
          <div className="max-w-lg">
            <div className="flex items-center gap-4">
              <Sprite
                sheet="/pixel/mascot-idle-sheet.png"
                frames={4}
                size={69}
                label="Thor, the Adventure Game hero"
              />
              <h2 className="font-pixel text-2xl uppercase tracking-wide sm:text-3xl">
                Join ATC
              </h2>
            </div>
            <p className="mt-4 font-terminal text-2xl text-foreground/60">
              <Typewriter text="> No experience required." startDelay={300} />
            </p>
            <div className="mt-8 space-y-4 font-terminal text-xl leading-snug">
              <p className="text-foreground/80">
                ATC is the Algorithmic Thinking Club at Bonney Lake High School.
                Most weeks that means building a project with other people who
                like making things. Some weeks it means getting ready for
                SkillsUSA.
              </p>
              <p className="text-foreground/60">
                You don&apos;t need any coding experience to join. We&apos;ll
                help you get started. If you already know how to code, even
                better.
              </p>
            </div>
            <div className="mt-10">
              <p className="font-pixel text-[11px] uppercase tracking-[0.25em] text-accent crt-glow blink">
                Ready to join?
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Button href="https://docs.google.com/forms/d/1wPuw8keLqSHSA38l9J5ISKGpPCaf5OhQ2yovKxT9yYs" external>
                  Sign Up
                </Button>
                <Button href="/" variant="secondary">
                  Back Home
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* image side */}
        <div className="relative h-72 lg:h-auto lg:flex-1">
          <Image
            src="/club-booth.jpg"
            alt="ATC booth at BLHS club fair"
            fill
            className="object-cover opacity-40 lg:opacity-50"
          />
          <div className="hidden absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent lg:hidden" />
          <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />
        </div>
      </div>

      <Section title="What You Get" subtitle="Why it's worth your time.">
        <Reveal>
          <div className="pixel-border grid bg-panel sm:grid-cols-2">
            {loot.map((item, i) => (
              <div
                key={item.title}
                className={`flex gap-4 p-6 ${i % 2 === 0 ? "sm:border-r-2 sm:border-line" : ""} ${i < loot.length - 2 ? "border-b-2 border-line" : i === loot.length - 2 ? "border-b-2 border-line sm:border-b-0" : ""}`}
              >
                <Image
                  src="/pixel/ui-star.png"
                  alt=""
                  width={20}
                  height={20}
                  className="pixelated twinkle mt-1 h-5 w-5 shrink-0"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
                <div>
                  <h3 className="font-pixel text-xs uppercase">{item.title}</h3>
                  <p className="mt-2 font-terminal text-lg leading-snug text-foreground/60">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>
    </>
  );
}
