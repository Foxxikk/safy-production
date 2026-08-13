import "server-only";
import { head, put } from "@vercel/blob";
import {
  cases as defaultCases,
  caseStats as defaultFacts,
  pillars as defaultPillars,
  stats as defaultStats,
  categories as defaultCategories,
  bxIntro as defaultIntro,
} from "./bx";

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
    pillars: JSON.parse(JSON.stringify(defaultPillars)),
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

/** Doplní chybějící pole, aby starší uložená data nerozbila web. */
function normalize(data) {
  const d = { ...buildDefaults(), ...data };
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
