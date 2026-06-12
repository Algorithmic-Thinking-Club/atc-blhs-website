"use client";

import { useState } from "react";
import Card from "@/components/Card";
import type { MemberYear } from "@/data/members";

export default function MembersGrid({ years }: { years: MemberYear[] }) {
  const [selectedYear, setSelectedYear] = useState(years[0].year);
  const current =
    years.find((y) => y.year === selectedYear) ?? years[0];

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <label htmlFor="member-year" className="text-sm text-zinc-400">
          School year
        </label>
        <select
          id="member-year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 focus:border-accent focus:outline-none"
        >
          {years.map((y) => (
            <option key={y.year} value={y.year}>
              {y.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {current.members.map((member) => (
          <Card
            key={member.name}
            className="flex flex-col items-center text-center sm:items-start sm:text-left"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-lg font-bold text-zinc-400">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-accent">{member.role}</p>
            {member.grade && (
              <p className="mt-1 text-xs text-zinc-500">{member.grade}</p>
            )}
            {member.bio && (
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {member.bio}
              </p>
            )}
            {member.hobby && (
              <p className="mt-2 text-xs text-zinc-500">
                <span className="text-zinc-400">Hobbies:</span> {member.hobby}
              </p>
            )}
            {member.wants && (
              <p className="mt-1 text-xs text-zinc-500">
                <span className="text-zinc-400">Wants to build:</span>{" "}
                {member.wants}
              </p>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
