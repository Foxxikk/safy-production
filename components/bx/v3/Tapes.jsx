"use client";

/**
 * Dvě překřížené jedoucí pásky na předělu mezi sekcemi.
 *
 * Pásky mají dělit sekce, ne se mezi nimi jen tak vznášet — proto je pruh
 * vysoký, pásky silné a mají mezi sebou odstup. V návrhu byly jen 18 px od
 * sebe, takže se po většině šířky překrývaly a texty si lezly do sebe;
 * teď se kříží jen u krajů, což vypadá zamýšleně.
 */
export default function Tapes({ words = [], className = "", brand = false }) {
  // Na druhém a třetím předělu už obory nemá cenu opakovat — pásky tam
  // nesou jméno značky, každá jinou půlku, ať se text nezdvojuje.
  const line = brand ? Array.from({ length: 12 }, () => "We are šafy") : [...words, ...words];
  const safy = Array.from({ length: 12 });

  return (
    <div aria-hidden className={`relative h-[300px] overflow-hidden md:h-[400px] ${className}`}>
      {/* Tmavá páska s obory */}
      <div
        className="absolute -left-16 -right-16 top-[34px] z-[2] overflow-hidden bg-ink py-6 text-white md:top-[46px] md:py-8"
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
        className="absolute -left-16 -right-16 top-[166px] z-[1] overflow-hidden bg-brand py-5 text-ink md:top-[214px] md:py-7"
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
