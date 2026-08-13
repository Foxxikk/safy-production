"use client";

import { useRef, useState } from "react";

const inputCls =
  "w-full border border-ink/15 bg-white px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ink transition-colors";
const labelCls = "block text-[12.5px] text-ink/55 mb-1.5";

export default function CaseEditor({ item, categories, onBack, onChange, slugify }) {
  const [lang, setLang] = useState("cs");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const dragFrom = useRef(null);

  const L = item[lang] || { title: "", subtitle: "", intro: "", body: [] };
  const facts = item.facts?.[lang] || [];

  const setLangField = (field, value) =>
    onChange({ [lang]: { ...L, [field]: value } });

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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-[14px] text-ink/55 hover:text-ink transition-colors"
        >
          ← Zpět na seznam
        </button>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Levý sloupec — texty */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-ink/10 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Název ({lang.toUpperCase()})</label>
                <input
                  className={inputCls}
                  value={L.title || ""}
                  onChange={(e) => {
                    setLangField("title", e.target.value);
                    if (lang === "cs" && !item.slug) onChange({ slug: slugify(e.target.value) });
                  }}
                />
              </div>
              <div>
                <label className={labelCls}>Podtitulek ({lang.toUpperCase()})</label>
                <input
                  className={inputCls}
                  value={L.subtitle || ""}
                  onChange={(e) => setLangField("subtitle", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mt-4">
              <div>
                <label className={labelCls}>Adresa (slug)</label>
                <input
                  className={inputCls}
                  value={item.slug || ""}
                  onChange={(e) => onChange({ slug: slugify(e.target.value) })}
                />
                <p className="mt-1 text-[12px] text-ink/40">
                  /safy-bx/{item.slug || "…"}
                </p>
              </div>
              <div>
                <label className={labelCls}>Kategorie</label>
                <select
                  className={inputCls}
                  value={item.category}
                  onChange={(e) => onChange({ category: e.target.value })}
                >
                  {Object.entries(categories?.cs || {}).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls}>Úvodní odstavec ({lang.toUpperCase()})</label>
              <textarea
                rows={3}
                className={inputCls}
                value={L.intro || ""}
                onChange={(e) => setLangField("intro", e.target.value)}
              />
            </div>
          </div>

          {/* Odstavce */}
          <div className="bg-white border border-ink/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Text ({lang.toUpperCase()})</h3>
              <button
                onClick={() => setLangField("body", [...(L.body || []), ""])}
                className="text-[13px] border border-ink/15 px-3 py-1.5 hover:border-ink"
              >
                + Odstavec
              </button>
            </div>
            <div className="space-y-3">
              {(L.body || []).map((p, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={p}
                    onChange={(e) => setBody(i, e.target.value)}
                  />
                  <button
                    onClick={() =>
                      setLangField("body", L.body.filter((_, n) => n !== i))
                    }
                    className="text-ink/30 hover:text-red-600 px-1 shrink-0"
                    title="Smazat odstavec"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {(L.body || []).length === 0 && (
                <p className="text-[13px] text-ink/40">Zatím žádný odstavec.</p>
              )}
            </div>
          </div>

          {/* Projekt v číslech */}
          <div className="bg-white border border-ink/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Projekt v číslech ({lang.toUpperCase()})</h3>
              <button
                onClick={() => setFacts([...facts, { value: "", label: "" }])}
                className="text-[13px] border border-ink/15 px-3 py-1.5 hover:border-ink"
              >
                + Číslo
              </button>
            </div>
            <div className="space-y-2">
              {facts.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={`${inputCls} sm:w-40`}
                    placeholder="80 kg"
                    value={f.value}
                    onChange={(e) => {
                      const n = [...facts];
                      n[i] = { ...n[i], value: e.target.value };
                      setFacts(n);
                    }}
                  />
                  <input
                    className={inputCls}
                    placeholder="popis čísla"
                    value={f.label}
                    onChange={(e) => {
                      const n = [...facts];
                      n[i] = { ...n[i], label: e.target.value };
                      setFacts(n);
                    }}
                  />
                  <button
                    onClick={() => setFacts(facts.filter((_, n) => n !== i))}
                    className="text-ink/30 hover:text-red-600 px-1 shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {facts.length === 0 && (
                <p className="text-[13px] text-ink/40">Zatím žádná čísla.</p>
              )}
            </div>
          </div>
        </div>

        {/* Pravý sloupec — stav a fotky */}
        <div className="space-y-5">
          <div className="bg-white border border-ink/10 p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(item.published)}
                onChange={(e) => onChange({ published: e.target.checked })}
                className="h-4 w-4 accent-[#79d97c]"
              />
              <span className="text-[14.5px]">Publikováno na webu</span>
            </label>
            <p className="mt-2 text-[12.5px] text-ink/45">
              Skryté reference se na webu nezobrazí ani nepůjdou otevřít.
            </p>
          </div>

          <div className="bg-white border border-ink/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Fotky ({item.images?.length || 0})</h3>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-[13px] border border-ink/15 px-3 py-1.5 hover:border-ink disabled:opacity-50"
              >
                {uploading ? "Nahrávám…" : "+ Nahrát"}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => upload([...e.target.files])}
            />

            <p className="text-[12.5px] text-ink/45 mb-3">
              První fotka je titulní. Pořadí změníte přetažením.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {(item.images || []).map((src, i) => (
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
                    <span className="absolute left-0 top-0 bg-brand text-ink text-[10px] px-1.5 py-0.5">
                      titulní
                    </span>
                  )}
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute right-0 top-0 bg-white/90 text-ink/60 hover:text-red-600 text-[12px] w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Odebrat"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {(item.images || []).length === 0 && (
              <p className="text-[13px] text-ink/40">Zatím žádné fotky.</p>
            )}
          </div>

          {item.slug && item.published && (
            <a
              href={`/safy-bx/${item.slug}`}
              target="_blank"
              rel="noreferrer"
              className="block text-center border border-ink/15 py-2.5 text-[14px] hover:border-ink transition-colors"
            >
              Otevřít na webu ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
