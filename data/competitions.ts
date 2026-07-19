export type Competition = {
  title: string;
  event: string;
  date: string;
  result: string;
  description: string;
  image?: string;
};

export const competitions: Competition[] = [
  {
    title: "SkillsUSA Regionals",
    event: "Computer Programming",
    date: "2026",
    result: "Podium Sweep (1st, 2nd, 3rd)",
    description:
      "ATC took 1st, 2nd, and 3rd at SkillsUSA regionals in Computer Programming. All three qualified for state.",
  },
  {
    title: "SkillsUSA State",
    event: "Computer Programming",
    date: "2026",
    result: "Gold & Bronze",
    description:
      "Two ATC members on the podium at the Washington state SkillsUSA championship in Computer Programming: gold and bronze. The gold medalist advanced to nationals.",
  },
  {
    title: "SkillsUSA Nationals",
    event: "Computer Programming",
    date: "2026",
    result: "Competed",
    description:
      "Represented Washington state at the SkillsUSA National Leadership & Skills Conference in Atlanta this summer.",
  },
];
