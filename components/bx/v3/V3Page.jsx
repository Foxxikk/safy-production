"use client";

import { v3 } from "@/lib/bxV3";
import { useLang } from "../LangContext";
import Contact from "./Contact";
import Hero from "./Hero";
import Pillars from "./Pillars";
import RefGrid from "./RefGrid";
import Tapes from "./Tapes";
import V3Header from "./V3Header";

/**
 * Úvodní stránka podle návrhu klientky.
 * Obsah i reference se berou z adminu, návrh dodává jen rozvržení a chování.
 */
export default function V3Page({ data = {}, cases = [], heroImage }) {
  const { lang } = useLang();
  const t = v3[lang] || v3.cs;
  const pillars = (data.pillars?.[lang] || []).filter((p) => p.published !== false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink">
      <V3Header />

      <main id="top">
        <Hero
          t={t}
          intro={data.intro?.[lang] || ""}
          image={heroImage}
          video={data.settings?.heroVideo || ""}
        />

        {/* Světlý tečkovaný blok: pásky + pilíře */}
        <div className="bx3-dots overflow-hidden">
          <Tapes words={t.tape} />
          <Pillars t={t} pillars={pillars} />
        </div>

        <RefGrid t={t} cases={cases} categories={data.categories?.[lang] || {}} lang={lang} />
      </main>

      <Contact t={t} settings={data.settings} />
    </div>
  );
}
