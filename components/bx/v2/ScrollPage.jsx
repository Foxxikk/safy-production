"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { statementHighlight } from "@/lib/bx";
import ContactForm from "../ContactForm";
import { useLang } from "../LangContext";
import HeroScreen from "./HeroScreen";
import ServicesScreens from "./ServicesScreens";
import StatementScreen from "./StatementScreen";
import V2Header from "./V2Header";
import WorkScreens from "./WorkScreens";

const HINT = "Scroll to continue";

/** Rozdělí text na věty — každá pak dostane vlastní krok scrollu. */
function toSentences(text = "") {
  return (text.match(/[^.!?]+[.!?]*/g) || []).map((s) => s.trim()).filter(Boolean);
}

/**
 * Scrollovací verze úvodní stránky.
 *
 * Celá stránka je jeden posuvník, ve kterém scroll zaskakuje po celých
 * obrazovkách. Sekce služeb a referencí zůstávají přilepené a scroll v nich
 * přepíná obsah, takže návštěvník projde všechno, místo aby to přeletěl.
 */
export default function ScrollPage({ data = {}, cases = [], previews = {}, heroImage }) {
  const { lang } = useLang();
  const scroller = useRef(null);
  const [index, setIndex] = useState(0);
  const [under, setUnder] = useState(0); // obrazovka, která je právě pod hlavičkou

  const pillars = useMemo(
    () => (data.pillars?.[lang] || []).filter((p) => p.published !== false),
    [data.pillars, lang]
  );

  // Z úvodního textu bereme první dvě věty — zbytek o divizi je v patičce.
  const sentences = useMemo(
    () => toSentences(data.intro?.[lang] || "").slice(0, 2),
    [data.intro, lang]
  );

  const work = useMemo(() => cases.slice(0, 8), [cases]);

  const start = useMemo(() => {
    const statement = 1;
    const services = statement + Math.max(1, sentences.length);
    const workAt = services + pillars.length;
    return { statement, services, work: workAt, contact: workAt + work.length };
  }, [sentences.length, pillars.length, work.length]);

  const total = start.contact + 1;

  // Která obrazovka je právě vidět. Všechny mají přesně výšku posuvníku,
  // takže stačí podíl — žádné pozorovatele není potřeba.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = el.clientHeight || 1;
        const clamp = (v) => Math.max(0, Math.min(total - 1, v));
        setIndex(clamp(Math.round(el.scrollTop / h)));
        // Barva hlavičky se musí přepnout hned, jak se pod ni nasune další
        // sekce — ne až v polovině přechodu, jinak bílý text chvíli svítí
        // na světlém podkladu.
        setUnder(clamp(Math.floor((el.scrollTop + 70) / h)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  const goTo = useCallback((n) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: n * el.clientHeight, behavior: "smooth" });
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Tmavé sekce (fotka v úvodu, služby) chtějí bílou hlavičku
  const tone =
    under === 0 || (under >= start.services && under < start.work) ? "light" : "dark";

  return (
    <>
      <V2Header tone={tone} onContact={() => goTo(start.contact)} />

      <div
        ref={scroller}
        className="bx-snap h-[100svh] overflow-y-auto overflow-x-clip bg-[#f1f1ef] text-ink"
      >
        <HeroScreen
          image={heroImage}
          words={["Brand", "Experience", "Marketing"]}
          hint={HINT}
          onNext={next}
        />

        <StatementScreen
          sentences={sentences}
          highlight={statementHighlight[lang] || ""}
          step={Math.max(0, index - start.statement)}
          hint={HINT}
          onNext={next}
        />

        <ServicesScreens
          pillars={pillars}
          previews={previews}
          step={Math.max(0, index - start.services)}
          hint={HINT}
          onNext={next}
        />

        <WorkScreens
          cases={work}
          categories={data.categories?.[lang] || {}}
          lang={lang}
          title={lang === "cs" ? "Vybrané projekty" : "Selected work"}
          step={Math.max(0, index - start.work)}
          hint={HINT}
          onNext={next}
        />

        <section className="bx-screen min-h-[100svh] bg-[#f1f1ef]">
          <ContactForm settings={data.settings} compact />
        </section>
      </div>
    </>
  );
}
