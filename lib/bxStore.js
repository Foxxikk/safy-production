import "server-only";
import { head, put } from "@vercel/blob";
import {
  cases as defaultCases,
  caseStats as defaultFacts,
  pillars as defaultPillars,
  stats as defaultStats,
  categories as defaultCategories,
  bxIntro as defaultIntro,
  pillarDetails as defaultPillarDetails,
  aboutPage as defaultAbout,
  heroClaim as defaultClaim,
} from "./bx";

/** Pořadí pilířů odpovídá pořadí adres níže — 1:1 s lib/bx.js. */
const PILLAR_SLUGS = [
  "kreativni-strategie",
  "materialy-a-technologie",
  "vlastni-dilna-vyroba",
  "proverene-know-how",
];

/** Klíč dokumentu s obsahem webu v Blob storage. */
export const DATA_KEY = "bx/data.json";

/**
 * Výchozí obsah — použije se, dokud v adminu nikdo nic neuložil.
 * Fotky jsou zatím statické soubory v /public; nové se nahrávají do Blobu.
 */
export function buildDefaults() {
  return {
    version: 1,
    updatedAt: null,
    intro: { ...defaultIntro },
    settings: { ...defaultSettings },
    about: JSON.parse(JSON.stringify(defaultAbout)),
    claim: JSON.parse(JSON.stringify(defaultClaim)),
    pillars: {
      cs: defaultPillars.cs.map((p, i) => withDetail(p, PILLAR_SLUGS[i], "cs")),
      en: defaultPillars.en.map((p, i) => withDetail(p, PILLAR_SLUGS[i], "en")),
    },
    stats: JSON.parse(JSON.stringify(defaultStats)),
    categories: JSON.parse(JSON.stringify(defaultCategories)),
    cases: defaultCases.map((c, i) => ({
      id: c.slug,
      slug: c.slug,
      category: c.category,
      published: true,
      order: i,
      images: Array.from(
        { length: c.images },
        (_, n) => `/images/bx/${c.slug}/${String(n + 1).padStart(2, "0")}.webp`
      ),
      cs: { ...c.cs, body: [...c.cs.body] },
      en: { ...c.en, body: [...c.en.body] },
      facts: {
        cs: defaultFacts[c.slug]?.cs ? [...defaultFacts[c.slug].cs] : [],
        en: defaultFacts[c.slug]?.en ? [...defaultFacts[c.slug].en] : [],
      },
    })),
  };
}

/** Spojí krátký text pilíře s obsahem jeho podstránky. */
function withDetail(pillar, slug, lang) {
  const d = defaultPillarDetails[slug] || {};
  const L = d[lang] || {};
  return {
    slug: slug || "",
    title: pillar.title,
    text: pillar.text,
    category: d.category || "",
    lead: L.lead || "",
    body: [...(L.body || [])],
    bullets: [...(L.bullets || [])],
    image: "",
    published: true,
  };
}

/** Výchozí nastavení webu — přepisovatelné v adminu. */
export const defaultSettings = {
  company: "Šafy production s.r.o.",
  address: "Údolní 212/1, 147 00, Praha 4",
  ico: "24769444",
  email: "info@safyproduction.cz",
  emailCasting: "casting@safyproduction.cz",
  phone: "",
  notifyEmail: "",
  seoTitle: "ŠAFY BX — Brand experience marketing",
  seoDescription:
    "Specializovaná divize Šafy pro Brand Experience marketing: kreativní strategie, interaktivní instalace a vlastní fyzická výroba.",
  showStats: true,
  perPage: 0,
};

/** Doplní chybějící pole, aby starší uložená data nerozbila web. */
function normalize(data) {
  const d = { ...buildDefaults(), ...data };
  d.settings = { ...defaultSettings, ...(data?.settings || {}) };
  d.about = {
    cs: { ...defaultAbout.cs, ...(data?.about?.cs || {}) },
    en: { ...defaultAbout.en, ...(data?.about?.en || {}) },
  };
  d.claim = {
    cs: { ...defaultClaim.cs, ...(data?.claim?.cs || {}) },
    en: { ...defaultClaim.en, ...(data?.claim?.en || {}) },
  };

  // Starší uložená data neměla u pilířů podstránky. Doplníme je z výchozího
  // obsahu, aby stránky nezůstaly prázdné, dokud je někdo nepřepíše v adminu.
  for (const lang of ["cs", "en"]) {
    d.pillars[lang] = (d.pillars?.[lang] || []).map((p, i) => {
      const slug = p.slug || PILLAR_SLUGS[i] || "";
      const def = defaultPillarDetails[slug] || {};
      const L = def[lang] || {};
      return {
        image: "",
        published: true,
        ...p,
        slug,
        category: p.category || def.category || "",
        lead: p.lead || L.lead || "",
        body: p.body?.length ? p.body : [...(L.body || [])],
        bullets: p.bullets?.length ? p.bullets : [...(L.bullets || [])],
      };
    });
  }
  d.cases = (d.cases || []).map((c, i) => ({
    published: true,
    order: i,
    images: [],
    facts: { cs: [], en: [] },
    ...c,
    cs: { title: "", subtitle: "", intro: "", body: [], ...(c.cs || {}) },
    en: { title: "", subtitle: "", intro: "", body: [], ...(c.en || {}) },
  }));
  d.cases.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return d;
}

/** Načte obsah z Blobu; když tam ještě nic není, vrátí výchozí data. */
export async function getSiteData({ fresh = false } = {}) {
  try {
    const meta = await head(DATA_KEY);
    const res = await fetch(meta.url, {
      cache: fresh ? "no-store" : "force-cache",
      next: fresh ? undefined : { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`blob fetch ${res.status}`);
    return normalize(await res.json());
  } catch {
    // Blob zatím neexistuje nebo není dostupný → výchozí obsah
    return buildDefaults();
  }
}

/** Uloží obsah do Blobu. */
export async function saveSiteData(data) {
  const payload = normalize({ ...data, updatedAt: new Date().toISOString() });
  await put(DATA_KEY, JSON.stringify(payload, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
  return payload;
}

/** Publikované reference ve správném pořadí — pro veřejný web. */
export function publishedCases(data) {
  return (data.cases || []).filter((c) => c.published !== false);
}
