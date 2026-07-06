import Link from "next/link";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
};

export default function Button({
  href,
  children,
  variant = "primary",
  external = false,
}: ButtonProps) {
  const base =
    "group inline-flex items-center justify-center gap-2 border-2 px-5 py-3 font-pixel text-xs uppercase tracking-wide transition-all duration-100 active:translate-y-1 active:shadow-none";
  const styles = {
    primary:
      "border-accent bg-accent text-[#06141a] shadow-[0_4px_0_0_var(--teal-deep)] hover:bg-[#7deef4]",
    secondary:
      "border-accent-deep bg-panel text-accent shadow-[0_4px_0_0_#050910] hover:border-accent hover:bg-panel-2",
  };

  const className = `${base} ${styles[variant]}`;
  const arrow = (
    <span
      aria-hidden
      className="opacity-0 transition-opacity duration-100 group-hover:opacity-100"
    >
      ▸
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {arrow}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {arrow}
      {children}
    </Link>
  );
}
