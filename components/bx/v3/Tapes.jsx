"use client";

/**
 * Předěl mezi dvěma sekcemi: dvě překřížené jedoucí pásky.
 *
 * Pruh má vlastní plnou plochu, ne průhled na tečkované pozadí stránky —
 * je to samostatný pás, ne mezera mezi sekcemi. Plocha je světlá, aby se
 * na ní obě pásky daly rozeznat; když měla nahoře barvu sekce nad sebou,
 * tmavá páska v ní zanikla a zbyl z toho jeden dvoubarevný blok.
 */
export default function Tapes({ words = [], bg = "#E8E8E5", brand = false }) {
  // Na druhém a třetím předělu už obory nemá cenu opakovat — pásky tam
  // nesou jméno značky, každá jinou půlku, ať se text nezdvojuje.
  const line = brand ? Array.from({ length: 12 }, () => "We are šafy") : [...words, ...words];
  const safy = Array.from({ length: 12 });

  return (
    <div
      aria-hidden
      className="relative h-[320px] overflow-hidden md:h-[420px]"
      style={{ background: bg }}
    >
      {/* Tmavá páska s obory */}
      <div
        className="absolute -left-16 -right-16 top-[46px] z-[2] overflow-hidden bg-ink py-6 text-white md:top-[70px] md:py-8"
        style={{ transform: "rotate(-2.2deg)" }}
      >
        <div className="bx3-marq">
          {line.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="whitespace-nowrap px-8 text-[32px] font-black uppercase tracking-[0.02em] md:text-[52px]"
            >
              {t} <span className="pl-8 text-brand">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* Zelená páska se jménem divize */}
      <div
        className="absolute -left-16 -right-16 top-[186px] z-[1] overflow-hidden bg-brand py-5 text-ink md:top-[236px] md:py-7"
        style={{ transform: "rotate(2.6deg)" }}
      >
        <div className="bx3-marq rev">
          {safy.map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap px-8 text-[28px] font-black uppercase md:text-[46px]"
            >
              {brand ? (
                <>
                  <span className="font-light normal-case">Brand experience</span>{" "}
                  <b className="font-bold normal-case">marketing</b> ×
                </>
              ) : (
                <>
                  We are šafy{" "}
                  <span className="font-light normal-case">| Brand experience</span>{" "}
                  <b className="font-bold normal-case">marketing</b> ×
                </>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
