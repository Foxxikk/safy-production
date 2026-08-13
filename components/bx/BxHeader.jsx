"use client";

import { useLang } from "./LangContext";
import { useTheme } from "./ThemeContext";
import { TapeLink } from "./TapeTransition";

export default function BxHeader() {
  const { lang, setLang } = useLang();
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-dark/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 h-16 md:h-[72px] flex items-center justify-between">
        {/* Bez loga — velké logo je hned pod hlavičkou v úvodu */}
        <TapeLink
          href="/safy-bx"
          aria-label="ŠAFY BX"
          className="text-[12px] tracking-[0.2em] text-ink/50 dark:text-white/50 hover:text-ink dark:hover:text-white transition-colors"
        >
          [ŠAFY BX]
        </TapeLink>

        <div className="flex items-center gap-3 md:gap-5">
          {/* Přepínač tématu */}
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Světlý režim" : "Tmavý režim"}
            className="flex h-8 w-8 items-center justify-center border border-ink/15 dark:border-white/20 text-ink/60 dark:text-white/60 hover:border-ink/50 dark:hover:border-white/60 transition-colors"
          >
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>

          <div className="flex items-center text-[13px]">
            {["cs", "en"].map((l, i) => (
              <span key={l} className="flex items-center">
                {i > 0 && <span className="mx-1.5 text-ink/20 dark:text-white/20">/</span>}
                <button
                  onClick={() => setLang(l)}
                  className={`uppercase transition-colors ${
                    lang === l
                      ? "text-ink dark:text-white"
                      : "text-ink/35 dark:text-white/35 hover:text-ink dark:hover:text-white"
                  }`}
                >
                  {l}
                </button>
              </span>
            ))}
          </div>

          <a
            href="#contact"
            className="group inline-flex items-center gap-2 bg-ink dark:bg-white text-white dark:text-ink pl-4 md:pl-5 pr-1.5 py-1.5 text-[13px] md:text-[14px] hover:bg-brand hover:text-ink transition-colors"
          >
            {lang === "cs" ? "Poptávka" : "Enquiry"}
            <span className="inline-flex h-7 w-7 items-center justify-center bg-white dark:bg-ink text-ink dark:text-white group-hover:bg-ink group-hover:text-white dark:group-hover:bg-ink transition-colors">
              →
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
