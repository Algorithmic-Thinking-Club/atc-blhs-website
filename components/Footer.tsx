import Image from "next/image";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t-2 border-line bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-wider text-foreground/50">
            <Image
              src="/pixel/ui-coin.png"
              alt=""
              width={16}
              height={16}
              className="pixelated"
            />
            {siteConfig.name} &middot; {siteConfig.school}
          </p>
          <p className="font-terminal text-lg text-foreground/40">
            EST. {siteConfig.founded} · CREDITS: ∞
          </p>
        </div>
      </div>
    </footer>
  );
}
