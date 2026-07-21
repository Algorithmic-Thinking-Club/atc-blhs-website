"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, siteConfig } from "@/data/site";
import { createClient } from "@/lib/supabase/client";

function NavItem({
  href,
  label,
  active,
  onClick,
  className = "",
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-1.5 font-pixel text-[11px] uppercase tracking-wider transition-colors ${
        active ? "text-accent crt-glow" : "text-foreground/50 hover:text-foreground"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`text-accent transition-opacity ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        ▸
      </span>
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hubHref, setHubHref] = useState("/hub/login");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        setHubHref(user ? "/hub" : "/hub/login");
      })
      .catch(() => {
        // hub backend may be offline; leave the default login link
      });
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b-2 border-line bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-pixel text-sm uppercase tracking-wider"
        >
          <Image src="/logo.png" alt="ATC" width={32} height={32} />
          {siteConfig.name}
        </Link>

        {/* desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
          <NavItem
            href={hubHref}
            label="Hub"
            active={pathname.startsWith("/hub")}
          />
          <Link
            href="/join"
            className="border-2 border-accent bg-accent px-3.5 py-2 font-pixel text-[10px] uppercase tracking-wider text-[#06141a] shadow-[0_3px_0_0_var(--teal-deep)] transition-all hover:bg-[#7deef4] active:translate-y-0.5 active:shadow-none"
          >
            Join ATC
          </Link>
        </div>

        {/* mobile toggle */}
        <button
          className="text-foreground/60 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="border-t-2 border-line px-6 pb-4 md:hidden">
          {navLinks.map((link) => (
            <NavItem
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
              onClick={() => setOpen(false)}
              className="py-2.5"
            />
          ))}
          <NavItem
            href={hubHref}
            label="Hub"
            active={pathname.startsWith("/hub")}
            onClick={() => setOpen(false)}
            className="py-2.5"
          />
          <Link
            href="/join"
            onClick={() => setOpen(false)}
            className="mt-3 inline-block border-2 border-accent bg-accent px-3.5 py-2 font-pixel text-[10px] uppercase tracking-wider text-[#06141a] shadow-[0_3px_0_0_var(--teal-deep)]"
          >
            Join ATC
          </Link>
        </div>
      )}
    </nav>
  );
}
