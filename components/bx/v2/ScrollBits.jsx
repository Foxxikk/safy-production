"use client";

/**
 * Drobné prvky, které se opakují napříč scrollovací verzí úvodní stránky.
 * Držíme je pohromadě, ať se stejný detail nekreslí v každé sekci znovu.
 */

/** Jemná tečkovaná mřížka na pozadí. */
export function Dots({ tone = "dark", className = "" }) {
  const color = tone === "light" ? "rgba(255,255,255,0.09)" : "rgba(55,55,54,0.16)";
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    />
  );
}

/** Čtvercové tlačítko se šipkou v brandové zelené. */
export function ArrowSquare({ className = "" }) {
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center bg-brand text-ink transition-transform duration-300 group-hover:rotate-45 ${className}`}
    >
      <svg width="45%" height="45%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </span>
  );
}

/**
 * Pobídka ke scrollování na spodní hraně obrazovky.
 * Zároveň funguje jako tlačítko na další obrazovku — kdo nechce scrollovat, klikne.
 */
export function ScrollHint({ tone = "dark", label = "Scroll to continue", onClick }) {
  const color = tone === "light" ? "text-white/75" : "text-ink/55";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute inset-x-0 bottom-5 md:bottom-7 z-30 flex items-center justify-center gap-3 ${color} hover:opacity-100 transition-opacity`}
    >
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
        <span className="bx-turn absolute inset-0 rounded-full border border-dashed border-current opacity-70" />
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          className="bx-nudge"
        >
          <path d="m5 8 7 8 7-8" />
        </svg>
      </span>
      <span className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

/**
 * Neviditelné „patra“ pod přilepenou sekcí.
 *
 * Sekce je vysoká n obrazovek, uvnitř zůstává vizuál přilepený a tahle
 * vrstva jen drží body, na které scroll zaskakuje. Záporný odsazovací
 * margin ji vytáhne přes vizuál, aby sekce nebyla o obrazovku vyšší.
 */
export function Steps({ n }) {
  return (
    <div className="relative -mt-[100svh] pointer-events-none" aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="bx-screen h-[100svh]" />
      ))}
    </div>
  );
}
