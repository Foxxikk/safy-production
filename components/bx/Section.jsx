"use client";

import Reveal from "./Reveal";

/** Jednotný kontejner + vertikální rytmus pro celou BX stránku. */
export function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1360px] px-6 md:px-12 ${className}`}>{children}</div>
  );
}

/**
 * Sekce s jednotným odsazením a volitelným popiskem v levém sloupci.
 * Layout: úzký sloupec s labelem | široký sloupec s obsahem.
 */
export default function Section({
  label,
  title,
  aside,
  children,
  divider = true,
  className = "",
  id,
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <Container>
        {divider && <div className="border-t border-black/[0.09] mb-14 md:mb-16" />}

        <div className="grid gap-y-8 md:grid-cols-12 md:gap-x-12">
          {(label || title) && (
            <div className="md:col-span-4 lg:col-span-3">
              <Reveal>
                {label && (
                  <p className="text-[12px] uppercase tracking-[0.22em] text-ink/35">{label}</p>
                )}
                {title && (
                  <h2 className="display-xl mt-3 text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05]">
                    {title}
                  </h2>
                )}
                {aside && <div className="mt-4">{aside}</div>}
              </Reveal>
            </div>
          )}

          <div className={label || title ? "md:col-span-8 lg:col-span-9" : "md:col-span-12"}>
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
