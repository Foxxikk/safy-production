"use client";

import Reveal from "./Reveal";

export function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-4 md:px-10 ${className}`}>{children}</div>
  );
}

/** Mikro-popisek v hranatých závorkách — [Brand experience] */
export function Label({ children, tone = "dark", className = "" }) {
  const color =
    tone === "light" ? "text-white/55" : "text-ink/45 dark:text-white/45";
  return (
    <span className={`text-[11px] md:text-[12px] tracking-[0.08em] ${color} ${className}`}>
      [{children}]
    </span>
  );
}

/** Čtvercové tlačítko se šipkou — brandově ostré, žádné zaoblení. */
export function ArrowPill({ tone = "dark", className = "", label = "" }) {
  const style =
    tone === "light"
      ? "border-white/25 text-white group-hover:bg-white group-hover:text-ink"
      : "border-ink/20 dark:border-white/25 text-ink dark:text-white group-hover:bg-ink dark:group-hover:bg-brand group-hover:text-white dark:group-hover:text-ink";
  return (
    <span
      aria-label={label}
      className={`inline-flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center border transition-colors ${style} ${className}`}
    >
      →
    </span>
  );
}

export default function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`py-12 md:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export { Reveal };
