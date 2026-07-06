"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // redirect if already logged in
  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        if (user) window.location.href = "/hub";
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });

      if (error) {
        if (/failed to fetch|network/i.test(error.message)) {
          setError("Can't reach the server. The hub is offline right now, try again shortly.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      // if email confirmation is required, user won't have a session yet
      if (data.user && !data.session) {
        setError("Check your email for a confirmation link, then log in.");
        setLoading(false);
        return;
      }

      window.location.href = "/hub";
    } catch {
      setError("Can't reach the server. The hub is offline right now, try again shortly.");
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full border-2 border-line bg-background px-3 py-2.5 font-terminal text-lg text-foreground placeholder-foreground/25 focus:border-accent focus:outline-none";
  const labelClass =
    "block font-pixel text-[10px] uppercase tracking-wider text-foreground/50";

  return (
    <div className="px-grid flex min-h-[calc(100dvh-65px)] items-center justify-center px-6 py-16">
      <div className="pixel-border w-full max-w-sm bg-panel">
        {/* CRT header strip */}
        <div className="scanlines relative border-b-2 border-line bg-panel-2 px-6 py-5">
          <p className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.3em] text-accent crt-glow">
            <Image src="/logo.png" alt="" width={18} height={18} />
            ATC Hub
          </p>
          <h1 className="mt-3 font-pixel text-xl uppercase tracking-wide">
            New Account
          </h1>
          <p className="mt-2 font-terminal text-lg text-foreground/50">
            &gt; create your save file
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-7">
          <div>
            <label htmlFor="name" className={labelClass}>
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className={inputClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="border-2 border-hp/40 bg-hp/10 px-3 py-2 font-terminal text-lg leading-snug text-hp">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-accent bg-accent py-3 font-pixel text-xs uppercase tracking-wider text-[#06141a] shadow-[0_4px_0_0_var(--teal-deep)] transition-all hover:bg-[#7deef4] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:hover:bg-accent"
          >
            {loading ? "Loading…" : "▸ Sign Up"}
          </button>
        </form>

        <p className="border-t-2 border-line px-6 py-5 text-center font-terminal text-lg text-foreground/50">
          Already have an account?{" "}
          <Link href="/hub/login" className="text-accent hover:crt-glow">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
