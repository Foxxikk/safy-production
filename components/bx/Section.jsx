"use client";

import Reveal from "./Reveal";

export function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-5 md:px-10 ${className}`}>{children}</div>
  );
}

/** Mikro-popisek v hranatých závorkách — [Brand experience] */
export function Label({ children, tone = "dark", className = "" }) {
  const color = tone === "light" ? "text-white/55" : "text-ink/45";
  return (
    <span className={`text-[12px] tracking-[0.08em] ${color} ${className}`}>[{children}]</span>
  );
}

/** Kulaté tlačítko se šipkou */
export function ArrowPill({ tone = "dark", className = "", label = "" }) {
  const style =
    tone === "light"
      ? "border-white/25 text-white group-hover:bg-white group-hover:text-ink"
      : "border-ink/20 text-ink group-hover:bg-ink group-hover:text-white";
  return (
    <span
      aria-label={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${style} ${className}`}
    >
      →
    </span>
  );
}

export default function Section({ children, className = "", id }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export { Reveal };
