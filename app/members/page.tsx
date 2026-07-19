import type { Metadata } from "next";
import Section from "@/components/Section";
import MembersGrid from "./members-grid";
import { memberYears } from "@/data/members";

export const metadata: Metadata = {
  title: "Members",
};

export default function MembersPage() {
  return (
    <Section title="Members" subtitle="The people behind ATC.">
      <MembersGrid years={memberYears} />
    </Section>
  );
}
