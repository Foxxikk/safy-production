"use client";

import { useState } from "react";
import { useLang } from "./LangContext";
import Reveal from "./Reveal";

const types = {
  cs: ["Festivalová zóna", "Pop-up / retail", "Výroba a stavba", "3D a grafika", "Jiné"],
  en: ["Festival zone", "Pop-up / retail", "Fabrication & build", "3D & graphics", "Other"],
};

const budgets = ["do 500 000 Kč", "500 000 – 1 500 000 Kč", "1 500 000 Kč+", "zatím nevím"];
const budgetsEn = ["up to 500k CZK", "500k – 1.5M CZK", "1.5M CZK+", "not sure yet"];

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
    "w-full border border-black/15 bg-white px-4 py-3 text-[15px] outline-none focus:border-brand transition-colors";
  const labelCls = "block text-[13px] font-medium text-ink/60 mb-2";

  return (
    <section id="contact" className="mx-auto max-w-[1500px] px-6 md:px-10 py-20">
      <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] items-start">
        <Reveal>
          <h2 className="display-xl text-4xl md:text-6xl leading-tight">{t.ctaTitle}</h2>
          <p className="mt-6 text-lg text-ink/60 max-w-md leading-relaxed">{t.ctaText}</p>
          <a
            href="mailto:info@safyproduction.cz"
            className="inline-block mt-8 text-lg font-bold border-b-2 border-brand pb-1 hover:text-brand transition-colors"
          >
            info@safyproduction.cz
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="bg-ink/[0.03] p-6 md:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
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
            </div>

            <div className="mt-5">
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

            <div className="grid gap-5 sm:grid-cols-2 mt-5">
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
                  {(lang === "cs" ? budgets : budgetsEn).map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className={labelCls} htmlFor="bx-msg">
                {t.formMessage}
              </label>
              <textarea
                id="bx-msg"
                rows={4}
                className={field}
                value={form.message}
                onChange={set("message")}
              />
            </div>

            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="mt-6 w-full sm:w-auto bg-ink text-white font-bold px-10 py-4 hover:bg-brand hover:text-ink transition-colors"
            >
              {t.formSubmit}
            </button>
            <p className="mt-3 text-[13px] text-ink/40">{t.formNote}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
