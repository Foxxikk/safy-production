/**
 * Texty, které přináší nový návrh a v původním obsahu nebyly —
 * rotující slovo v claimu, nápisy na páskách, razítko a popisky sekcí.
 * Reference a pilíře se dál berou z adminu, tady jsou jen „obalové" texty.
 */
export const v3 = {
  cs: {
    eyebrow: ["We are šafy", "Brand experience divize", "CZ & SK"],
    lead: "Stavíme",
    words: ["zážitky", "instalace", "zóny", "emoce"],
    tail: "na dotek.",
    // Zvýrazněná část úvodního odstavce — musí doslova sedět na text v intru
    introAccent: "emoční stopu.",
    seeRefs: "Prohlédnout reference",
    scroll: "Scroll to continue",
    stamp: "Nekreslíme vzdušné zámky × Stavíme je × ",
    tape: [
      "Kreativní strategie",
      "Materiály & technologie",
      "Vlastní dílna",
      "Výroba",
      "Prověřené know-how",
      "CZ & SK",
    ],
    pillarsTitle: ["Od nápadu", "po", "šroubek."],
    pillarsNote: ["Strategie, technologie, dílna a know-how", "pod jednou střechou."],
    flip: "Najeď a otoč",
    refsTitle: "Reference",
    refsNote: ["Stovky instalací.", "Vybíráme"],
    contactLabel: "Kontakt",
    contactTitle: ["Pojďme", "něco", "postavit."],
    follow: "Sledujte nás",
  },
  en: {
    eyebrow: ["We are šafy", "Brand experience division", "CZ & SK"],
    lead: "We build",
    words: ["experiences", "installations", "zones", "emotions"],
    tail: "you can touch.",
    introAccent: "an emotional footprint.",
    seeRefs: "See our work",
    scroll: "Scroll to continue",
    stamp: "We don't draw castles in the air × We build them × ",
    tape: [
      "Creative strategy",
      "Materials & technology",
      "Own workshop",
      "Fabrication",
      "Proven know-how",
      "CZ & SK",
    ],
    pillarsTitle: ["From the idea", "to the last", "screw."],
    pillarsNote: ["Strategy, technology, workshop and know-how", "under one roof."],
    flip: "Hover to flip",
    refsTitle: "Work",
    refsNote: ["Hundreds of installations.", "A selection of"],
    contactLabel: "Contact",
    contactTitle: ["Let's build", "something", "together."],
    follow: "Follow us",
  },
};

/** Druhá adresa z návrhu — v nastavení webu zatím není. */
export const officeSK = {
  company: "Šafy production SK s.r.o.",
  address: "Panónská cesta 34, 851 04 Bratislava",
  city: "Bratislava",
};

export const social = [
  { label: "Instagram", href: "https://www.instagram.com/safyproduction/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/%C5%A1afy-production-s-r-o-/" },
  { label: "Facebook", href: "https://www.facebook.com/safyproduction" },
];

/**
 * Rytmus mřížky referencí — kolik sloupců a jakou výšku dlaždice dostane.
 * Vychází z návrhu (7+5, pak trojice, …) a dokola se opakuje.
 */
const RHYTHM = [
  { span: 7, h: 580 },
  { span: 5, h: 580 },
  { span: 4, h: 400 },
  { span: 4, h: 400 },
  { span: 4, h: 400 },
  { span: 5, h: 520 },
  { span: 7, h: 520 },
  { span: 6, h: 440 },
  { span: 6, h: 440 },
  { span: 12, h: 460 },
];

export const cellFor = (i) => RHYTHM[i % RHYTHM.length];

/**
 * Barva dlaždice, do které se fotka reference ztrácí.
 *
 * U projektů, kterým barvu určil návrh, používáme jeho hodnoty. U ostatních
 * je spočítaná ze spodní části titulní fotky a ztmavená, aby na ní držel
 * bílý text — přechod pak nikde neskáče.
 */
const TILE_COLORS = {
  "red-bull-energy-zone": "#0E1B3D",
  "jagermeister-orange-grape-2025": "#8A3A08",
  "tullamore-dew-grape": "#0F4A2E",
  "iqos-lounge-karlovy-vary": "#064E50",
  "iqos-festival-zone": "#061150",
  "iqos-pop-up-store": "#064550",
  "jagermeister-tatra": "#502406",
  "builds-and-remodels": "#502406",
  "custom-bar-design-build": "#063350",
  "graphics-and-3d": "#431322",
};

const FALLBACK = ["#0E1B3D", "#0F4A2E", "#502406", "#431322", "#064E50"];

export const tileColor = (slug, i = 0) => TILE_COLORS[slug] || FALLBACK[i % FALLBACK.length];
