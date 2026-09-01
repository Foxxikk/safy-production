"use client";

import { useState } from "react";
import { Button, Card, Field, IconButton, TextArea, TextInput } from "./ui";
import { IconClose, IconPlus } from "./Icons";

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Seznam textových položek s přidáváním a mazáním — odstavce, odrážky. */
function ListEditor({ label, items, onChange, placeholder, multiline = false }) {
  const Input = multiline ? TextArea : TextInput;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12.5px] font-medium text-ink/60">{label}</span>
        <Button size="sm" icon={IconPlus} onClick={() => onChange([...items, ""])}>
          Přidat
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-[13px] text-ink/35">Zatím prázdné.</p>
      ) : (
        <div className="space-y-2">
          {items.map((v, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-4 pt-3 text-[12px] text-ink/25 tabular-nums shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <Input
                  rows={multiline ? 3 : undefined}
                  placeholder={placeholder}
                  value={v}
                  onChange={(e) => {
                    const n = [...items];
                    n[i] = e.target.value;
                    onChange(n);
                  }}
                />
              </div>
              <IconButton
                icon={IconClose}
                label="Smazat"
                danger
                onClick={() => onChange(items.filter((_, n) => n !== i))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Editace textů, které nejsou vázané na konkrétní referenci. */
export default function TextsEditor({ data, update }) {
  const [lang, setLang] = useState("cs");
  const [open, setOpen] = useState(null);
  const LANG = lang.toUpperCase();

  const pillars = data.pillars?.[lang] || [];
  const stats = data.stats?.[lang] || [];

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

  const move = (arr, setter) => (from, to) => {
    if (to < 0 || to >= arr.length) return;
    const next = [...arr];
    const [m] = next.splice(from, 1);
    next.splice(to, 0, m);
    setter(next);
  };
  const movePillar = move(pillars, setPillars);

  return (
    <div className="max-w-[1000px]">
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] text-ink/45 hidden sm:inline">Jazyk obsahu</span>
          <div className="inline-flex border border-ink/15 bg-white p-0.5">
            {["cs", "en"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 h-8 text-[13px] font-medium uppercase transition-colors ${
                  lang === l ? "bg-ink text-white" : "text-ink/50 hover:text-ink"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <Card
          title={`Hlavní claim (${LANG})`}
          description="Velký nadpis na začátku stránky. Dva řádky."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="První řádek">
              <TextInput
                value={data.claim?.[lang]?.line1 ?? ""}
                onChange={(e) =>
                  update((d) => {
                    d.claim = d.claim || {};
                    d.claim[lang] = { ...(d.claim[lang] || {}), line1: e.target.value };
                    return d;
                  })
                }
              />
            </Field>
            <Field label="Druhý řádek" hint="Podtržený barevnou linkou.">
              <TextInput
                value={data.claim?.[lang]?.line2 ?? ""}
                onChange={(e) =>
                  update((d) => {
                    d.claim = d.claim || {};
                    d.claim[lang] = { ...(d.claim[lang] || {}), line2: e.target.value };
                    return d;
                  })
                }
              />
            </Field>
          </div>
        </Card>

        <Card
          title={`Co děláme — pilíře (${LANG})`}
          description="Čtyři body na začátku stránky. Každý má i vlastní podstránku."
          action={
            <Button
              size="sm"
              icon={IconPlus}
              onClick={() =>
                setPillars([...pillars, { title: "", text: "", slug: "", lead: "", body: [], bullets: [], published: true }])
              }
            >
              Pilíř
            </Button>
          }
        >
          {pillars.length === 0 ? (
            <p className="text-[13.5px] text-ink/40">Zatím žádný pilíř.</p>
          ) : (
            <div className="divide-y divide-ink/[0.07] -my-2">
              {pillars.map((p, i) => {
                const set = (patch) => {
                  const n = [...pillars];
                  n[i] = { ...n[i], ...patch };
                  setPillars(n);
                };
                const isOpen = open === i;
                return (
                  <div key={i} className="py-3">
                    <div className="grid gap-2 md:grid-cols-[auto_1fr_2fr_auto] md:items-start">
                      <div className="flex items-center gap-1 md:pt-2.5">
                        <span className="text-[12px] text-ink/25 tabular-nums w-5">0{i + 1}</span>
                        <span className="hidden md:flex flex-col text-ink/25">
                          <button
                            onClick={() => movePillar(i, i - 1)}
                            disabled={i === 0}
                            title="Posunout nahoru"
                            className="hover:text-ink disabled:opacity-25 leading-none text-[11px]"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => movePillar(i, i + 1)}
                            disabled={i === pillars.length - 1}
                            title="Posunout dolů"
                            className="hover:text-ink disabled:opacity-25 leading-none text-[11px]"
                          >
                            ▼
                          </button>
                        </span>
                      </div>
                      <TextInput
                        placeholder="Název pilíře"
                        value={p.title || ""}
                        onChange={(e) => set({ title: e.target.value })}
                      />
                      <TextArea
                        rows={2}
                        placeholder="Krátký popis na úvodní stránce"
                        value={p.text || ""}
                        onChange={(e) => set({ text: e.target.value })}
                      />
                      <IconButton
                        icon={IconClose}
                        label="Smazat pilíř"
                        danger
                        className="md:mt-1"
                        onClick={() => setPillars(pillars.filter((_, n) => n !== i))}
                      />
                    </div>

                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="mt-2 ml-7 text-[12.5px] text-ink/50 hover:text-ink transition-colors"
                    >
                      {isOpen ? "Skrýt podstránku ▲" : "Upravit podstránku ▼"}
                      {p.slug && <span className="text-ink/30"> · /safy-bx/co-delame/{p.slug}</span>}
                    </button>

                    {isOpen && (
                      <div className="mt-3 ml-7 border-l-2 border-ink/10 pl-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Adresa podstránky" hint="Nechte prázdné a pilíř nebude proklikávací.">
                            <TextInput
                              value={p.slug || ""}
                              placeholder="kreativni-strategie"
                              onChange={(e) => set({ slug: slugify(e.target.value) })}
                            />
                          </Field>
                          <Field label="Kategorie referencí" hint="Určuje, které projekty se pod textem ukážou.">
                            <select
                              value={p.category || ""}
                              onChange={(e) => set({ category: e.target.value })}
                              className="w-full border border-ink/15 bg-white px-3 py-2.5 text-[14.5px] outline-none focus:border-ink"
                            >
                              <option value="">— žádná —</option>
                              {Object.entries(data.categories?.cs || {}).map(([k, v]) => (
                                <option key={k} value={k}>
                                  {v}
                                </option>
                              ))}
                            </select>
                          </Field>
                        </div>

                        <Field label="Výrazná věta pod nadpisem">
                          <TextArea
                            rows={2}
                            value={p.lead || ""}
                            onChange={(e) => set({ lead: e.target.value })}
                          />
                        </Field>

                        <ListEditor
                          label="Odstavce"
                          placeholder="Text odstavce"
                          multiline
                          items={p.body || []}
                          onChange={(body) => set({ body })}
                        />

                        <ListEditor
                          label="Odrážky „Konkrétně“"
                          placeholder="Např. 3D vizualizace a půdorysy"
                          items={p.bullets || []}
                          onChange={(bullets) => set({ bullets })}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card
            title={`Čísla za námi (${LANG})`}
            description="Statistiky pod výpisem referencí."
            action={
              <Button size="sm" icon={IconPlus} onClick={() => setStats([...stats, { value: "", label: "" }])}>
                Číslo
              </Button>
            }
          >
            {stats.length === 0 ? (
              <p className="text-[13.5px] text-ink/40">Zatím žádné číslo.</p>
            ) : (
              <div className="space-y-2">
                {stats.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-24 shrink-0">
                      <TextInput
                        className="font-medium"
                        placeholder="300+"
                        value={s.value}
                        onChange={(e) => {
                          const n = [...stats];
                          n[i] = { ...n[i], value: e.target.value };
                          setStats(n);
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <TextInput
                        placeholder="eventových instalací"
                        value={s.label}
                        onChange={(e) => {
                          const n = [...stats];
                          n[i] = { ...n[i], label: e.target.value };
                          setStats(n);
                        }}
                      />
                    </div>
                    <IconButton
                      icon={IconClose}
                      label="Smazat číslo"
                      danger
                      onClick={() => setStats(stats.filter((_, n) => n !== i))}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title={`Text o divizi (${LANG})`}
            description="Odstavec v patičce pod kontaktním formulářem."
          >
            <TextArea
              rows={9}
              value={data.intro?.[lang] || ""}
              onChange={(e) =>
                update((d) => {
                  d.intro[lang] = e.target.value;
                  return d;
                })
              }
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
