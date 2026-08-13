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

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export default function ContactForm({ intro = {}, settings = {} }) {
  const { lang, t } = useLang();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: "",
    budget: "",
    message: "",
    website: "", // honeypot
  });
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const email = settings.email || "info@safyproduction.cz";
  const emailCasting = settings.emailCasting || "casting@safyproduction.cz";

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !isEmail(form.email)) {
      setError(t.required);
      return;
    }
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/bx/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang, source: window.location.pathname }),
      });
      if (!res.ok) throw new Error("send failed");
      setState("sent");
    } catch {
      setState("error");
      setError(t.formFail);
    }
  };

  // Formulář zůstává v tmavé paletě, ale pole mají vlastní plochu a rámeček,
  // takže je poznat, kam se píše.
  const field =
    "w-full border border-white/20 bg-white/[0.06] px-3.5 py-2.5 text-[15.5px] text-white outline-none transition-colors placeholder:text-white/35 hover:border-white/35 focus:border-white/70 focus:bg-white/[0.11] [&>option]:text-ink";
  const labelCls = "block text-[12.5px] text-white/55 mb-1.5";

  return (
    <section id="contact" className="relative pt-16 md:pt-24 overflow-x-clip">
      {/* Páska Šafy — nahnutá, přesahuje světlou i tmavou sekci */}
      <div className="pointer-events-none absolute inset-x-0 top-1 md:top-4 z-20">
        <Image
          src="/images/tapes/tape-green.svg"
          alt=""
          aria-hidden
          width={2400}
          height={75}
          className="w-[124%] max-w-none -ml-[12%] -rotate-[2.5deg]"
        />
      </div>

      <div className="px-3 md:px-5">
        <div className="bg-dark dark:bg-black text-white pt-20 md:pt-28">
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
                <a href={`mailto:${email}`} className="mt-8 inline-flex items-center gap-3 group">
                  <span className="text-[17px] border-b border-white/40 pb-0.5">{email}</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center border border-white/25 group-hover:bg-white group-hover:text-ink transition-colors">
                    →
                  </span>
                </a>
              </Reveal>
            </div>

            {/* Formulář — světlá karta, ať je v tmavé sekci vidět */}
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={0.08}>
                {state === "sent" ? (
                  <div className="border border-white/15 bg-white/[0.04] p-8 md:p-10">
                    <p className="text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium leading-tight">
                      {t.formSent}
                    </p>
                    <p className="mt-3 text-white/55 text-[15px]">{t.formSentNote}</p>
                  </div>
                ) : (
                  <form
                    onSubmit={submit}
                    noValidate
                    className="border border-white/15 bg-white/[0.04] p-6 md:p-8"
                  >
                    <p className="text-[12px] uppercase tracking-[0.16em] text-white/45 mb-5">
                      {lang === "cs" ? "Nezávazná poptávka" : "Enquiry"}
                    </p>
                    {/* Honeypot — skryté pole pro roboty */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      value={form.website}
                      onChange={set("website")}
                      className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />

                    <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                      <div>
                        <label className={labelCls} htmlFor="bx-name">
                          {t.formName} *
                        </label>
                        <input id="bx-name" className={field} value={form.name} onChange={set("name")} />
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
                        <label className={labelCls} htmlFor="bx-phone">
                          {t.formPhone}
                        </label>
                        <input
                          id="bx-phone"
                          type="tel"
                          className={field}
                          value={form.phone}
                          onChange={set("phone")}
                        />
                      </div>
                      <div>
                        <label className={labelCls} htmlFor="bx-type">
                          {t.formType}
                        </label>
                        <select id="bx-type" className={field} value={form.type} onChange={set("type")}>
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
                      <div className="sm:col-span-2">
                        <label className={labelCls} htmlFor="bx-msg">
                          {t.formMessage}
                        </label>
                        <textarea
                          id="bx-msg"
                          rows={3}
                          className={`${field} resize-none`}
                          value={form.message}
                          onChange={set("message")}
                        />
                      </div>
                    </div>

                    {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="mt-6 inline-flex items-center gap-3 bg-white text-ink pl-6 pr-1.5 py-2 font-medium hover:bg-white/85 transition-colors disabled:opacity-50"
                    >
                      {state === "sending" ? t.formSending : t.formSubmit}
                      <span className="inline-flex h-9 w-9 items-center justify-center bg-ink text-white">
                        →
                      </span>
                    </button>
                    <p className="mt-3 text-[12.5px] text-white/35">{t.formNote}</p>
                  </form>
                )}
              </Reveal>
            </div>
          </div>

          {/* O divizi — popisný text patří sem dolů, ne na začátek stránky */}
          {intro[lang] && (
            <div className="mt-14 md:mt-20 border-t border-white/10 pt-8 md:pt-10">
              <Reveal>
                <div className="grid gap-4 md:gap-10 md:grid-cols-12">
                  <div className="md:col-span-3">
                    <Label tone="light">{lang === "cs" ? "O divizi" : "About the division"}</Label>
                  </div>
                  <p className="md:col-span-9 text-white/55 leading-[1.7] text-[14.5px] md:text-[16px] max-w-[78ch]">
                    {intro[lang]}
                  </p>
                </div>
              </Reveal>
            </div>
          )}

          {/* Patička uvnitř černého bloku */}
          <div className="mt-12 md:mt-16 grid gap-6 md:gap-8 border-t border-white/10 pt-8 md:pt-10 md:grid-cols-4 text-white/45 text-[13.5px] md:text-[14.5px]">
            <div>
              <Image src="/images/logos/safy-white.svg" alt="šafy" width={86} height={34} />
              <p className="mt-3 text-[12px] text-white/40">[ŠAFY BX]</p>
            </div>
            <div>
              <p className="text-white mb-1.5">{settings.company || "Šafy production s.r.o."}</p>
              <p>{settings.address || "Údolní 212/1, 147 00, Praha 4"}</p>
              {settings.ico && <p>IČO: {settings.ico}</p>}
            </div>
            <div>
              <a href={`mailto:${email}`} className="block hover:text-white transition-colors">
                {email}
              </a>
              {emailCasting && (
                <a
                  href={`mailto:${emailCasting}`}
                  className="block hover:text-white transition-colors"
                >
                  {emailCasting}
                </a>
              )}
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="block hover:text-white transition-colors">
                  {settings.phone}
                </a>
              )}
            </div>
            <div className="md:text-right">
              <Link href="/" className="hover:text-white transition-colors">
                {lang === "cs" ? "Hlavní web Šafy →" : "Main Šafy website →"}
              </Link>
              <p className="mt-3 text-white/25 text-[12.5px]">
                © {new Date().getFullYear()} — WE ARE ŠAFY
              </p>
            </div>
          </div>
        </Container>
        </div>
      </div>
    </section>
  );
}
