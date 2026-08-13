"use client";

import { useRef, useState } from "react";
import { Badge, Button, Card, EmptyState, Field, IconButton, Select, TextArea, TextInput, Toggle } from "./ui";
import {
  IconArrowLeft,
  IconClose,
  IconExternal,
  IconImage,
  IconPlus,
  IconStar,
  IconTrash,
  IconUpload,
} from "./Icons";

export default function CaseEditor({ item, categories, onBack, onChange, slugify }) {
  const [lang, setLang] = useState("cs");
  const [uploading, setUploading] = useState(false);
  const [dropping, setDropping] = useState(false);
  const fileRef = useRef(null);
  const dragFrom = useRef(null);

  const L = item[lang] || { title: "", subtitle: "", intro: "", body: [] };
  const facts = item.facts?.[lang] || [];
  const LANG = lang.toUpperCase();

  const setLangField = (field, value) => onChange({ [lang]: { ...L, [field]: value } });

  const setBody = (i, value) => {
    const body = [...(L.body || [])];
    body[i] = value;
    setLangField("body", body);
  };

  const setFacts = (next) => onChange({ facts: { ...item.facts, [lang]: next } });

  // ——— Fotky ———
  const upload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    const urls = [];
    for (const f of files) {
      const fd = new FormData();
      fd.append("file", f);
      fd.append("slug", item.slug || "misc");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const d = await res.json();
        urls.push(d.url);
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Nahrání se nezdařilo.");
      }
    }
    if (urls.length) onChange({ images: [...(item.images || []), ...urls] });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const moveImage = (from, to) => {
    const arr = [...(item.images || [])];
    const [m] = arr.splice(from, 1);
    arr.splice(to, 0, m);
    onChange({ images: arr });
  };

  const removeImage = (i) =>
    onChange({ images: (item.images || []).filter((_, n) => n !== i) });

  const images = item.images || [];

  return (
    <div className="max-w-[1100px]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Button icon={IconArrowLeft} variant="ghost" size="sm" onClick={onBack} className="-ml-3">
          Zpět na seznam
        </Button>

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

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ——— Texty ——— */}
        <div className="lg:col-span-2 space-y-5">
          <Card title="Základní údaje" description={`Texty se ukládají zvlášť pro každý jazyk (teď ${LANG}).`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Název (${LANG})`}>
                <TextInput
                  value={L.title || ""}
                  placeholder="Např. IQOS Festival Zone"
                  onChange={(e) => {
                    setLangField("title", e.target.value);
                    if (lang === "cs" && !item.slug) onChange({ slug: slugify(e.target.value) });
                  }}
                />
              </Field>
              <Field label={`Podtitulek (${LANG})`} hint="Jedna věta pod názvem ve výpisu.">
                <TextInput
                  value={L.subtitle || ""}
                  placeholder="Víc než promo — celodenní zážitek"
                  onChange={(e) => setLangField("subtitle", e.target.value)}
                />
              </Field>
              <Field label="Adresa stránky" hint={`/safy-bx/${item.slug || "…"}`}>
                <TextInput
                  value={item.slug || ""}
                  onChange={(e) => onChange({ slug: slugify(e.target.value) })}
                />
              </Field>
              <Field label="Kategorie" hint="Podle ní se reference filtruje na webu.">
                <Select value={item.category} onChange={(e) => onChange({ category: e.target.value })}>
                  {Object.entries(categories?.cs || {}).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field
              label={`Úvodní odstavec (${LANG})`}
              hint="Výrazný text hned pod fotkou. Ideálně dvě věty."
              className="mt-4"
            >
              <TextArea
                value={L.intro || ""}
                onChange={(e) => setLangField("intro", e.target.value)}
              />
            </Field>
          </Card>

          <Card
            title={`Popis projektu (${LANG})`}
            description="Odstavce vpravo vedle úvodního textu."
            action={
              <Button size="sm" icon={IconPlus} onClick={() => setLangField("body", [...(L.body || []), ""])}>
                Odstavec
              </Button>
            }
          >
            {(L.body || []).length === 0 ? (
              <p className="text-[13.5px] text-ink/40">
                Zatím žádný odstavec. Přidejte první tlačítkem nahoře.
              </p>
            ) : (
              <div className="space-y-3">
                {(L.body || []).map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="w-5 pt-3 text-[12px] text-ink/25 tabular-nums shrink-0">
                      {i + 1}
                    </span>
                    <TextArea value={p} onChange={(e) => setBody(i, e.target.value)} />
                    <IconButton
                      icon={IconClose}
                      label="Smazat odstavec"
                      danger
                      className="mt-1"
                      onClick={() => setLangField("body", L.body.filter((_, n) => n !== i))}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title={`Projekt v číslech (${LANG})`}
            description="Tři až čtyři čísla vypadají nejlíp."
            action={
              <Button size="sm" icon={IconPlus} onClick={() => setFacts([...facts, { value: "", label: "" }])}>
                Číslo
              </Button>
            }
          >
            {facts.length === 0 ? (
              <p className="text-[13.5px] text-ink/40">
                Zatím žádná čísla. Např. „80 kg“ a „nosnost konstrukce“.
              </p>
            ) : (
              <div className="space-y-2">
                {facts.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <TextInput
                      className="sm:w-40 shrink-0 font-medium"
                      placeholder="80 kg"
                      value={f.value}
                      onChange={(e) => {
                        const n = [...facts];
                        n[i] = { ...n[i], value: e.target.value };
                        setFacts(n);
                      }}
                    />
                    <TextInput
                      placeholder="nosnost konstrukce"
                      value={f.label}
                      onChange={(e) => {
                        const n = [...facts];
                        n[i] = { ...n[i], label: e.target.value };
                        setFacts(n);
                      }}
                    />
                    <IconButton
                      icon={IconClose}
                      label="Smazat číslo"
                      danger
                      onClick={() => setFacts(facts.filter((_, n) => n !== i))}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ——— Stav a fotky ——— */}
        <div className="space-y-5">
          <Card title="Viditelnost">
            <Toggle
              checked={Boolean(item.published)}
              onChange={(v) => onChange({ published: v })}
              label={item.published ? "Publikováno na webu" : "Skryto"}
              description={
                item.published
                  ? "Reference je vidět ve výpisu i na vlastní stránce."
                  : "Reference se na webu nezobrazí a nepůjde otevřít."
              }
            />
            {item.slug && item.published && (
              <Button
                as="a"
                href={`/safy-bx/${item.slug}`}
                target="_blank"
                rel="noreferrer"
                icon={IconExternal}
                size="sm"
                className="mt-4 w-full"
              >
                Otevřít na webu
              </Button>
            )}
          </Card>

          <Card
            title={`Fotky (${images.length})`}
            description="První je titulní. Pořadí změníte přetažením."
            action={
              <Button
                size="sm"
                icon={IconUpload}
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Nahrávám…" : "Nahrát"}
              </Button>
            }
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => upload([...e.target.files])}
            />

            {images.length === 0 ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropping(true);
                }}
                onDragLeave={() => setDropping(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDropping(false);
                  upload([...e.dataTransfer.files].filter((f) => f.type.startsWith("image/")));
                }}
                className={`border border-dashed py-10 px-4 text-center transition-colors ${
                  dropping ? "border-ink bg-ink/[0.03]" : "border-ink/20"
                }`}
              >
                <IconImage size={22} className="mx-auto text-ink/25" />
                <p className="mt-3 text-[13.5px] text-ink/50">
                  Přetáhněte fotky sem nebo je vyberte tlačítkem.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {images.map((src, i) => (
                  <div
                    key={src + i}
                    draggable
                    onDragStart={() => (dragFrom.current = i)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragFrom.current !== null && dragFrom.current !== i) {
                        moveImage(dragFrom.current, i);
                        dragFrom.current = i;
                      }
                    }}
                    onDragEnd={() => (dragFrom.current = null)}
                    className="relative group cursor-grab active:cursor-grabbing"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="aspect-[4/3] w-full object-cover bg-ink/5" />
                    {i === 0 && (
                      <span className="absolute left-0 top-0 inline-flex items-center gap-1 bg-ink text-white text-[10px] px-1.5 py-1">
                        <IconStar size={10} />
                        titulní
                      </span>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      title="Odebrat fotku"
                      className="absolute right-0 top-0 grid h-6 w-6 place-items-center bg-white/90 text-ink/60 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconTrash size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
