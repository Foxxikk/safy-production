"use client";

/**
 * Dvě překřížené jedoucí pásky.
 * Obsah je v každé pásce dvakrát — animace posune pás o polovinu jeho šířky,
 * takže smyčka navazuje bez skoku.
 */
export default function Tapes({ words = [] }) {
  const line = [...words, ...words];
  const safy = Array.from({ length: 10 });

  return (
    <div aria-hidden className="relative -mx-10 h-[150px] overflow-hidden">
      {/* Tmavá páska s obory */}
      <div
        className="absolute inset-x-0 top-[34px] z-[2] overflow-hidden bg-ink py-3 text-white"
        style={{ transform: "rotate(-2.2deg)" }}
      >
        <div className="bx3-marq">
          {line.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="whitespace-nowrap px-[18px] text-[22px] font-black uppercase tracking-[0.02em]"
            >
              {t} <span className="pl-[18px] text-brand">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* Zelená páska se jménem divize */}
      <div
        className="absolute inset-x-0 top-[52px] z-[1] overflow-hidden bg-brand py-2.5 text-ink"
        style={{ transform: "rotate(2.6deg)" }}
      >
        <div className="bx3-marq rev">
          {safy.map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap px-[18px] text-[20px] font-black uppercase"
            >
              We are šafy{" "}
              <span className="font-light normal-case">| Brand experience</span>{" "}
              <b className="font-bold normal-case">marketing</b> ×
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
