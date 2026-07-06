type SectionProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({
  title,
  subtitle,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={`py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        {title && (
          <div className="mb-10">
            <h2 className="flex items-center gap-3 font-pixel text-xl uppercase tracking-wide sm:text-2xl">
              <span
                aria-hidden
                className="inline-block h-3 w-3 shrink-0 bg-accent shadow-[3px_3px_0_0_var(--teal-deep)]"
              />
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3 font-terminal text-xl text-foreground/50">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
