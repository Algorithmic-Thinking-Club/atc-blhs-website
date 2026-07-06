"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import type { MemberYear } from "@/data/members";

// knight and wizard are reserved for club leadership
const MEMBER_POOL = [1, 4, 5, 6];

/** deterministic avatar per member so it's stable across renders */
function avatarFor(name: string, role: string) {
  if (role.includes("President") && role.includes("Founder") && !role.includes("Vice"))
    return "/pixel/avatar-2.png"; // knight leads the party
  if (role.includes("Vice")) return "/pixel/avatar-3.png"; // wizard
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return `/pixel/avatar-${MEMBER_POOL[hash % MEMBER_POOL.length]}.png`;
}

function levelFor(grade?: string) {
  switch (grade) {
    case "Freshman":
      return 9;
    case "Sophomore":
      return 10;
    case "Junior":
      return 11;
    case "Senior":
      return 12;
    default:
      return null;
  }
}

export default function MembersGrid({ years }: { years: MemberYear[] }) {
  const [selectedYear, setSelectedYear] = useState(years[0].year);
  const current = years.find((y) => y.year === selectedYear) ?? years[0];

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <label
          htmlFor="member-year"
          className="font-pixel text-[10px] uppercase tracking-wider text-foreground/50"
        >
          Save file
        </label>
        <select
          id="member-year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border-2 border-line bg-panel px-3 py-1.5 font-terminal text-lg text-foreground focus:border-accent focus:outline-none"
        >
          {years.map((y) => (
            <option key={y.year} value={y.year}>
              {y.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {current.members.map((member, i) => {
          const level = levelFor(member.grade);
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.08 }}
              className="group pixel-border relative flex flex-col bg-panel p-6 transition-colors duration-150 hover:bg-panel-2"
            >
              {/* selector cursor appears on hover, like a character select screen */}
              <span
                aria-hidden
                className="menu-cursor absolute left-2 top-2 hidden text-accent group-hover:block"
              >
                ▸
              </span>

              <div className="flex items-center gap-4">
                <Image
                  src={member.image ?? avatarFor(member.name, member.role)}
                  alt=""
                  width={64}
                  height={64}
                  className="pixelated border-2 border-line transition-colors group-hover:border-accent-deep"
                />
                <div className="min-w-0">
                  <h3 className="font-pixel text-xs uppercase leading-relaxed">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-pixel text-[10px] uppercase tracking-wider text-accent">
                    {member.role}
                  </p>
                  {level && (
                    <p className="mt-1 font-terminal text-lg text-gold">
                      LVL {level}
                    </p>
                  )}
                </div>
              </div>

              {member.bio && (
                <p className="mt-4 font-terminal text-lg leading-snug text-foreground/60">
                  {member.bio}
                </p>
              )}
              {member.hobby && (
                <p className="mt-3 font-terminal text-base leading-snug text-foreground/40">
                  <span className="text-foreground/60">Side quests:</span>{" "}
                  {member.hobby}
                </p>
              )}
              {member.wants && (
                <p className="mt-2 font-terminal text-base leading-snug text-foreground/40">
                  <span className="text-foreground/60">Wants to build:</span>{" "}
                  {member.wants}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
