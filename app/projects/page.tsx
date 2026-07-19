import type { Metadata } from "next";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Reveal from "@/components/fx/Reveal";
import XpBar from "@/components/fx/XpBar";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
};

const questStatus = {
  active: { label: "Active", className: "text-xp", progress: 80 },
  paused: { label: "On hold", className: "text-gold", progress: 45 },
  planned: { label: "Planned", className: "text-foreground/40", progress: 10 },
} as const;

export default function ProjectsPage() {
  return (
    <Section title="Projects" subtitle="What we're building and what's next.">
      <div className="space-y-6">
        {projects.map((project, i) => {
          const status = questStatus[project.status];
          return (
            <Reveal key={project.title} delay={i * 0.1}>
              <div className="pixel-border bg-panel p-6 transition-colors duration-150 hover:bg-panel-2 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p
                      className={`font-pixel text-[10px] uppercase tracking-wider ${status.className}`}
                    >
                      ◆ {status.label}
                    </p>
                    <h3 className="mt-3 font-pixel text-base uppercase">
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                  </div>
                  {project.tech && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="border border-line bg-panel-2 px-2 py-0.5 font-terminal text-base text-foreground/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="mt-4 max-w-3xl font-terminal text-xl leading-snug text-foreground/60">
                  {project.description}
                </p>

                <div className="mt-6 max-w-sm">
                  <XpBar percent={project.progress ?? status.progress} label="Progress" />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="pixel-border mt-10 flex flex-wrap items-center gap-4 bg-panel p-5">
        <p className="font-terminal text-xl text-foreground/60">
          All our code is public.
        </p>
        <Button
          href="https://github.com/Algorithmic-Thinking-Club"
          external
          variant="secondary"
        >
          GitHub
        </Button>
      </div>
    </Section>
  );
}
