"use client";

import { useState } from "react";
import { Button, Card, Field, IconButton, TextArea, TextInput } from "./ui";
import { IconClose, IconPlus } from "./Icons";

/** Editace textů, které nejsou vázané na konkrétní referenci. */
export default function TextsEditor({ data, update }) {
  const [lang, setLang] = useState("cs");
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
          title={`Co děláme — pilíře (${LANG})`}
          description="Čtyři body hned na začátku stránky."
          action={
            <Button size="sm" icon={IconPlus} onClick={() => setPillars([...pillars, { title: "", text: "" }])}>
              Pilíř
            </Button>
          }
        >
          {pillars.length === 0 ? (
            <p className="text-[13.5px] text-ink/40">Zatím žádný pilíř.</p>
          ) : (
            <div className="space-y-3">
              {pillars.map((p, i) => (
                <div key={i} className="grid gap-2 md:grid-cols-[auto_1fr_2fr_auto] md:items-start">
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
                    value={p.title}
                    onChange={(e) => {
                      const n = [...pillars];
                      n[i] = { ...n[i], title: e.target.value };
                      setPillars(n);
                    }}
                  />
                  <TextArea
                    rows={2}
                    placeholder="Krátký popis"
                    value={p.text}
                    onChange={(e) => {
                      const n = [...pillars];
                      n[i] = { ...n[i], text: e.target.value };
                      setPillars(n);
                    }}
                  />
                  <IconButton
                    icon={IconClose}
                    label="Smazat pilíř"
                    danger
                    className="md:mt-1"
                    onClick={() => setPillars(pillars.filter((_, n) => n !== i))}
                  />
                </div>
              ))}
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
