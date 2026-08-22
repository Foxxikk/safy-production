"use client";

/**
 * Ručně kreslené prvky z brandu (podtržení, zakroužkování, blesk…).
 *
 * Vykreslujeme je přes CSS masku, ne jako <img> — díky tomu převezmou barvu
 * textu, takže fungují i v tmavém režimu bez druhé sady souborů.
 */
export default function Doodle({ name, className = "", style, ...rest }) {
  const url = `url(/images/doodles/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none block bg-current ${className}`}
      style={{
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        ...style,
      }}
      {...rest}
    />
  );
}

/** Poměry stran jednotlivých prvků — ať se nemusí dohledávat v SVG. */
export const DOODLE_RATIO = {
  blesk: 45 / 86,
  hvezda: 48 / 45,
  koruna: 58 / 56,
  krizek: 39 / 40,
  "podtrzeni-1": 277 / 15,
  "podtrzeni-2": 330 / 51,
  "podtrzeni-3": 91 / 14,
  "podtrzeni-4": 177 / 15,
  sipka: 118 / 46,
  srdce: 97 / 120,
  zakrouzkovani: 434 / 93,
};
