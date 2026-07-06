export type Project = {
  title: string;
  status: "active" | "paused" | "planned";
  description: string;
  tech?: string[];
  link?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    title: "ATC Club Website",
    status: "active",
    description:
      "The site you're on. We rebuilt it in 2026 with pixel art and a game UI to match what the club is actually building.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "WiseGraph",
    link: "https://wisegraph.vercel.app",
    status: "active",
    description:
      "A data visualization tool built for David Wiseman, a student support specialist at BLHS. It tracks student progress across terms and he uses it in real parent meetings.",
    tech: ["TypeScript", "React", "Recharts"],
  },
  {
    title: "Adventure Game",
    status: "planned",
    description:
      "A collaborative BLHS school-life game. The core framework is built over summer 2026, and ATC members build individual modules and minigames during the school year as plugins. Meant to be a fun onboarding project for new students and a long-term club effort.",
    tech: ["TypeScript"],
  },
];
