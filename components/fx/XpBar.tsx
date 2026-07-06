"use client";

import { motion } from "motion/react";

type XpBarProps = {
  /** 0-100 */
  percent: number;
  label?: string;
};

/** RPG progress bar that fills when scrolled into view. */
export default function XpBar({ percent, label }: XpBarProps) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <p className="font-pixel text-[9px] uppercase tracking-wider text-foreground/40">
            {label}
          </p>
          <p className="font-terminal text-base text-xp">{percent}%</p>
        </div>
      )}
      <div className="h-4 border-2 border-line bg-background p-0.5">
        <motion.div
          className="h-full bg-xp"
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </div>
    </div>
  );
}
