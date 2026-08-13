"use client";

import { useState } from "react";

const inputCls =
  "w-full border border-ink/15 bg-white px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ink transition-colors";
const labelCls = "block text-[12.5px] text-ink/55 mb-1.5";

/** Editace textů, které nejsou vázané na konkrétní referenci. */
export default function TextsEditor({ data, update }) {
  const [lang, setLang] = useState("cs");

  const pillars = data.pillars?.[lang] || [];
  const stats = data.stats?.[lang] || [];
  const cats = data.categories?.[lang] || {};

  const setPillars = (next) =>
    update((d) => {
      d.pillars[lang] = next;
      return d;
    });
  const setStats = (next) =>
    update((d) => {
      d.stats[lang] = next;
      return d;
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium">Texty webu</h2>
        <div className="flex items-center gap-1 text-[13px]">
          {["cs", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 uppercase transition-colors ${
                lang === l ? "bg-ink text-white" : "text-ink/50 hover:text-ink"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Úvodní text */}
        <div className="bg-white border border-ink/10 p-5">
          <h3 className="font-medium mb-3">Úvodní odstavec „Kdo jsme“</h3>
          <textarea
            rows={7}
            className={inputCls}
            value={data.intro?.[lang] || ""}
            onChange={(e) =>
              update((d) => {
                d.intro[lang] = e.target.value;
                return d;
              })
            }
          />
        </div>

        {/* Čísla */}
        <div className="bg-white border border-ink/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Čísla za námi</h3>
            <button
              onClick={() => setStats([...stats, { value: "", label: "" }])}
              className="text-[13px] border border-ink/15 px-3 py-1.5 hover:border-ink"
            >
              + Číslo
            </button>
          </div>
          <div className="space-y-2">
            {stats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={`${inputCls} sm:w-36`}
                  placeholder="300+"
                  value={s.value}
                  onChange={(e) => {
                    const n = [...stats];
                    n[i] = { ...n[i], value: e.target.value };
                    setStats(n);
                  }}
                />
                <input
                  className={inputCls}
                  placeholder="popis"
                  value={s.label}
                  onChange={(e) => {
                    const n = [...stats];
                    n[i] = { ...n[i], label: e.target.value };
                    setStats(n);
                  }}
                />
                <button
                  onClick={() => setStats(stats.filter((_, n) => n !== i))}
                  className="text-ink/30 hover:text-red-600 px-1 shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pilíře */}
        <div className="bg-white border border-ink/10 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Co děláme — pilíře</h3>
            <button
              onClick={() => setPillars([...pillars, { title: "", text: "" }])}
              className="text-[13px] border border-ink/15 px-3 py-1.5 hover:border-ink"
            >
              + Pilíř
            </button>
          </div>
          <div className="space-y-3">
            {pillars.map((p, i) => (
              <div key={i} className="grid gap-2 md:grid-cols-[1fr_2fr_auto] items-start">
                <input
                  className={inputCls}
                  placeholder="Název"
                  value={p.title}
                  onChange={(e) => {
                    const n = [...pillars];
                    n[i] = { ...n[i], title: e.target.value };
                    setPillars(n);
                  }}
                />
                <textarea
                  rows={2}
                  className={inputCls}
                  placeholder="Popis"
                  value={p.text}
                  onChange={(e) => {
                    const n = [...pillars];
                    n[i] = { ...n[i], text: e.target.value };
                    setPillars(n);
                  }}
                />
                <button
                  onClick={() => setPillars(pillars.filter((_, n) => n !== i))}
                  className="text-ink/30 hover:text-red-600 px-1 pt-2.5"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kategorie */}
        <div className="bg-white border border-ink/10 p-5 lg:col-span-2">
          <h3 className="font-medium mb-3">Názvy kategorií</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(cats).map(([key, value]) => (
              <div key={key}>
                <label className={labelCls}>{key}</label>
                <input
                  className={inputCls}
                  value={value}
                  onChange={(e) =>
                    update((d) => {
                      d.categories[lang][key] = e.target.value;
                      return d;
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
