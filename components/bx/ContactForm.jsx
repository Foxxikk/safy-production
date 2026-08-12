"use client";

import { useState } from "react";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";
import Section from "./Section";

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
    "w-full border-b border-black/15 bg-transparent py-3 text-[16px] outline-none focus:border-brand transition-colors";
  const labelCls = "block text-[12px] uppercase tracking-[0.14em] text-ink/40 mb-1";

  const aside = (
    <>
      <p className="text-ink/60 leading-[1.7] text-[16px] max-w-[34ch]">{t.ctaText}</p>
      <a
        href="mailto:info@safyproduction.cz"
        className="inline-block mt-6 text-[17px] font-medium border-b-2 border-brand pb-0.5 hover:text-brand transition-colors"
      >
        info@safyproduction.cz
      </a>
    </>
  );

  return (
    <Section id="contact" label="05 — Kontakt" title={t.ctaTitle} aside={aside}>
      <Reveal>
        <form onSubmit={submit} className="max-w-2xl">
          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
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
          </div>

          <div className="mt-7">
            <label className={labelCls} htmlFor="bx-msg">
              {t.formMessage}
            </label>
            <textarea
              id="bx-msg"
              rows={3}
              className={field}
              value={form.message}
              onChange={set("message")}
            />
          </div>

          {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-8 bg-ink text-white font-medium px-9 py-4 hover:bg-brand hover:text-ink transition-colors"
          >
            {t.formSubmit}
          </button>
          <p className="mt-3 text-[13px] text-ink/35">{t.formNote}</p>
        </form>
      </Reveal>
    </Section>
  );
}
