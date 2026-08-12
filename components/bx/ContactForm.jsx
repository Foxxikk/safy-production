"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import { Container, Label } from "./Section";

const types = {
  cs: ["Festivalová zóna", "Pop-up / retail", "Výroba a stavba", "3D a grafika", "Jiné"],
  en: ["Festival zone", "Pop-up / retail", "Fabrication & build", "3D & graphics", "Other"],
};

const budgets = {
  cs: ["do 500 000 Kč", "500 000 – 1 500 000 Kč", "1 500 000 Kč+", "zatím nevím"],
  en: ["up to 500k CZK", "500k – 1.5M CZK", "1.5M CZK+", "not sure yet"],
};

export default function ContactForm() {
  const { lang, t } = useLang();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    type: "",
    budget: "",
    message: "",
  });
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError(t.required);
      return;
    }
    setError("");
    const subject = `ŠAFY BX — poptávka: ${form.company || form.name}`;
    const body = [
      `${t.formName}: ${form.name}`,
      `${t.formCompany}: ${form.company}`,
      `${t.formEmail}: ${form.email}`,
      `${t.formType}: ${form.type}`,
      `${t.formBudget}: ${form.budget}`,
      "",
      `${t.formMessage}:`,
      form.message,
    ].join("\n");
    window.location.href = `mailto:info@safyproduction.cz?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full border-b border-white/20 bg-transparent py-3 text-[15.5px] text-white outline-none focus:border-brand transition-colors placeholder:text-white/30 [&>option]:text-ink";
  const labelCls = "block text-[12px] text-white/40 mb-1";

  return (
    <section id="contact" className="pt-8 md:pt-10">
      <div className="bg-dark dark:bg-black text-white overflow-hidden">
        {/* Brandový proužek — rovný, bez uriznuteho textu */}
        <div className="bg-brand text-ink overflow-hidden py-2.5 md:py-3">
          <div className="flex w-max animate-marquee items-center whitespace-nowrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="mx-5 text-[12px] md:text-[13px] font-medium tracking-[0.18em] uppercase"
              >
                We are Šafy <span className="mx-2 opacity-50">✕</span> Brand experience
              </span>
            ))}
          </div>
        </div>

        <Container className="py-11 md:py-18">
          <div className="grid gap-10 md:gap-14 md:grid-cols-12">
            {/* Levá strana — velký claim */}
            <div className="md:col-span-5">
              <Reveal>
                <Label tone="light">{lang === "cs" ? "Kontakt" : "Contact"}</Label>
                <h2 className="mt-5 text-[clamp(1.7rem,4.4vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.015em]">
                  {t.ctaTitle}
                </h2>
                <p className="mt-6 text-white/50 leading-relaxed max-w-[34ch] text-[15.5px]">
                  {t.ctaText}
                </p>
                <a
                  href="mailto:info@safyproduction.cz"
                  className="mt-8 inline-flex items-center gap-3 group"
                >
                  <span className="text-[17px] border-b border-brand pb-0.5">
                    info@safyproduction.cz
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center border border-white/25 group-hover:bg-white group-hover:text-ink transition-colors">
                    →
                  </span>
                </a>
              </Reveal>
            </div>

            {/* Formulář */}
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={0.08}>
                <form onSubmit={submit}>
                  <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                      <label className={labelCls} htmlFor="bx-name">
                        {t.formName} *
                      </label>
                      <input
                        id="bx-name"
                        className={field}
                        value={form.name}
                        onChange={set("name")}
                      />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="bx-company">
                        {t.formCompany}
                      </label>
                      <input
                        id="bx-company"
                        className={field}
                        value={form.company}
                        onChange={set("company")}
                      />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="bx-email">
                        {t.formEmail} *
                      </label>
                      <input
                        id="bx-email"
                        type="email"
                        className={field}
                        value={form.email}
                        onChange={set("email")}
                      />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="bx-type">
                        {t.formType}
                      </label>
                      <select
                        id="bx-type"
                        className={field}
                        value={form.type}
                        onChange={set("type")}
                      >
                        <option value="">—</option>
                        {types[lang].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="bx-budget">
                        {t.formBudget}
                      </label>
                      <select
                        id="bx-budget"
                        className={field}
                        value={form.budget}
                        onChange={set("budget")}
                      >
                        <option value="">—</option>
                        {budgets[lang].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="bx-msg">
                        {t.formMessage}
                      </label>
                      <input
                        id="bx-msg"
                        className={field}
                        value={form.message}
                        onChange={set("message")}
                      />
                    </div>
                  </div>

                  {error && <p className="mt-5 text-sm text-red-400">{error}</p>}

                  <button
                    type="submit"
                    className="mt-8 inline-flex items-center gap-3 bg-white text-ink pl-6 pr-1.5 py-2 font-medium hover:bg-brand transition-colors"
                  >
                    {t.formSubmit}
                    <span className="inline-flex h-9 w-9 items-center justify-center bg-ink text-white">
                      →
                    </span>
                  </button>
                  <p className="mt-3 text-[12.5px] text-white/30">{t.formNote}</p>
                </form>
              </Reveal>
            </div>
          </div>

          {/* Patička uvnitř černého bloku */}
          <div className="mt-12 md:mt-16 grid gap-6 md:gap-8 border-t border-white/10 pt-8 md:pt-10 md:grid-cols-4 text-white/45 text-[13.5px] md:text-[14.5px]">
            <div>
              <Image src="/images/logos/safy-white.svg" alt="šafy" width={86} height={34} />
              <p className="mt-3 text-[12px] text-brand">[ŠAFY BX]</p>
            </div>
            <div>
              <p className="text-white mb-1.5">Šafy production s.r.o.</p>
              <p>Údolní 212/1, 147 00, Praha 4</p>
              <p>IČO: 24769444</p>
            </div>
            <div>
              <a href="mailto:info@safyproduction.cz" className="block hover:text-brand transition-colors">
                info@safyproduction.cz
              </a>
              <a href="mailto:casting@safyproduction.cz" className="block hover:text-brand transition-colors">
                casting@safyproduction.cz
              </a>
            </div>
            <div className="md:text-right">
              <Link href="/" className="hover:text-brand transition-colors">
                {lang === "cs" ? "Hlavní web Šafy →" : "Main Šafy website →"}
              </Link>
              <p className="mt-3 text-white/25 text-[12.5px]">
                © {new Date().getFullYear()} — WE ARE ŠAFY
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
