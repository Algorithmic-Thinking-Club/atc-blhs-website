import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import Reveal from "@/components/fx/Reveal";
import { competitions } from "@/data/competitions";

export const metadata: Metadata = {
  title: "Competitions",
};

const rankIcons = [
  "/pixel/badge-trophy.png",
  "/pixel/badge-medal.png",
  "/pixel/badge-rocket.png",
];

export default function CompetitionsPage() {
  return (
    <div className="relative overflow-hidden">
      <Image
        src="/skillsusa-state.jpg"
        alt=""
        fill
        className="pointer-events-none object-cover opacity-10"
      />
      <Section
        title="Competitions"
        subtitle="Every SkillsUSA run so far, regionals to nationals."
        className="relative z-10"
      >
        <div className="space-y-4">
          {competitions.map((comp, i) => (
            <Reveal key={comp.title} delay={i * 0.12} from="left">
              <div className="pixel-border flex flex-col gap-4 bg-panel p-5 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-center gap-5 sm:w-56 sm:shrink-0">
                  <span className="font-pixel text-2xl text-gold gold-glow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Image
                    src={rankIcons[i % rankIcons.length]}
                    alt=""
                    width={44}
                    height={44}
                    className="pixelated"
                  />
                  <div>
                    <h3 className="font-pixel text-xs uppercase leading-relaxed">
                      {comp.title}
                    </h3>
                    <p className="font-terminal text-base text-foreground/40">
                      {comp.event} · {comp.date}
                    </p>
                  </div>
                </div>
                <p className="flex-1 font-terminal text-xl leading-snug text-foreground/60">
                  {comp.description}
                </p>
                <p className="font-pixel text-[10px] uppercase tracking-wider text-gold sm:w-40 sm:shrink-0 sm:text-right">
                  {comp.result}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-10 font-terminal text-xl text-foreground/40">
          Next up: SkillsUSA nationals in Atlanta, summer 2026.
        </p>
      </Section>
    </div>
  );
}
