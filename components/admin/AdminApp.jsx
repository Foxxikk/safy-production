"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CaseEditor from "./CaseEditor";
import TextsEditor from "./TextsEditor";

const emptyCase = () => ({
  id: `case-${Date.now()}`,
  slug: "",
  category: "festival",
  published: false,
  images: [],
  cs: { title: "", subtitle: "", intro: "", body: [""] },
  en: { title: "", subtitle: "", intro: "", body: [""] },
  facts: { cs: [], en: [] },
});

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminApp({ initialData }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState("cases");
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(initialData.updatedAt);
  const [toast, setToast] = useState("");
  const dragFrom = useRef(null);

  const update = useCallback((fn) => {
    setData((d) => {
      const next = typeof fn === "function" ? fn(structuredClone(d)) : fn;
      return next;
    });
    setDirty(true);
  }, []);

  // Varování při odchodu s neuloženými změnami
  useEffect(() => {
    const h = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      const d = await res.json();
      setSavedAt(d.updatedAt);
      setDirty(false);
      flash("Uloženo a publikováno");
    } else {
      flash("Uložení se nezdařilo", true);
    }
  };

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  // Ctrl/Cmd+S
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const cases = data.cases || [];
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(
      (c) =>
        c.cs?.title?.toLowerCase().includes(q) ||
        c.en?.title?.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q)
    );
  }, [cases, query]);

  // ——— Drag & drop pořadí ———
  const onDragStart = (i) => (e) => {
    dragFrom.current = i;
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (i) => (e) => {
    e.preventDefault();
    const from = dragFrom.current;
    if (from === null || from === i) return;
    update((d) => {
      const arr = d.cases;
      const [moved] = arr.splice(from, 1);
      arr.splice(i, 0, moved);
      arr.forEach((c, n) => (c.order = n));
      return d;
    });
    dragFrom.current = i;
  };
  const onDragEnd = () => {
    dragFrom.current = null;
  };

  const addCase = () => {
    const c = emptyCase();
    update((d) => {
      d.cases.unshift(c);
      d.cases.forEach((x, n) => (x.order = n));
      return d;
    });
    setEditingId(c.id);
  };

  const duplicate = (id) =>
    update((d) => {
      const i = d.cases.findIndex((c) => c.id === id);
      const copy = structuredClone(d.cases[i]);
      copy.id = `case-${Date.now()}`;
      copy.slug = `${copy.slug}-kopie`;
      copy.published = false;
      copy.cs.title = `${copy.cs.title} (kopie)`;
      d.cases.splice(i + 1, 0, copy);
      d.cases.forEach((x, n) => (x.order = n));
      return d;
    });

  const remove = (id) => {
    const c = cases.find((x) => x.id === id);
    if (!confirm(`Opravdu smazat referenci „${c?.cs?.title || c?.slug}“?`)) return;
    update((d) => {
      d.cases = d.cases.filter((x) => x.id !== id);
      d.cases.forEach((x, n) => (x.order = n));
      return d;
    });
    if (editingId === id) setEditingId(null);
  };

  const togglePublish = (id) =>
    update((d) => {
      const c = d.cases.find((x) => x.id === id);
      c.published = !c.published;
      return d;
    });

  const editing = cases.find((c) => c.id === editingId) || null;

  return (
    <div className="min-h-screen">
      {/* Horní lišta */}
      <header className="sticky top-0 z-30 bg-white border-b border-ink/10">
        <div className="mx-auto max-w-[1400px] px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="font-medium">ŠAFY BX — administrace</span>
            <nav className="hidden sm:flex items-center gap-1 text-[14px]">
              {[
                ["cases", `Reference (${cases.length})`],
                ["texts", "Texty webu"],
              ].map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => {
                    setTab(k);
                    setEditingId(null);
                  }}
                  className={`px-3 py-1.5 transition-colors ${
                    tab === k ? "bg-ink text-white" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:block text-[12.5px] text-ink/45">
              {dirty
                ? "Neuložené změny"
                : savedAt
                ? `Uloženo ${new Date(savedAt).toLocaleString("cs-CZ")}`
                : "Zatím neuloženo"}
            </span>
            <a
              href="/safy-bx"
              target="_blank"
              rel="noreferrer"
              className="text-[14px] text-ink/60 hover:text-ink underline underline-offset-4"
            >
              Zobrazit web
            </a>
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="bg-ink text-white px-5 py-2 text-[14px] font-medium hover:bg-brand hover:text-ink transition-colors disabled:opacity-40"
            >
              {saving ? "Ukládám…" : "Uložit a publikovat"}
            </button>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.reload();
              }}
              className="text-[13px] text-ink/45 hover:text-ink"
            >
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-8">
        {tab === "texts" && <TextsEditor data={data} update={update} />}

        {tab === "cases" && !editing && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Hledat referenci…"
                className="w-full sm:w-72 border border-ink/15 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-ink"
              />
              <button
                onClick={addCase}
                className="bg-brand text-ink px-5 py-2.5 text-[14px] font-medium hover:bg-ink hover:text-white transition-colors"
              >
                + Nová reference
              </button>
            </div>

            <p className="text-[13px] text-ink/45 mb-3">
              Pořadí na webu změníte přetažením řádku za úchyt vlevo.
            </p>

            <ul className="space-y-2">
              {shown.map((c) => {
                const realIndex = cases.findIndex((x) => x.id === c.id);
                return (
                  <li
                    key={c.id}
                    draggable={!query}
                    onDragStart={onDragStart(realIndex)}
                    onDragOver={onDragOver(realIndex)}
                    onDragEnd={onDragEnd}
                    className="flex items-center gap-3 bg-white border border-ink/10 px-3 py-3 hover:border-ink/25 transition-colors"
                  >
                    <span
                      className={`select-none text-ink/25 px-1 ${
                        query ? "opacity-30" : "cursor-grab active:cursor-grabbing"
                      }`}
                      title={query ? "Pro řazení zrušte hledání" : "Přetáhněte pro změnu pořadí"}
                    >
                      ⠿
                    </span>
                    <span className="w-7 text-[12px] text-ink/35 tabular-nums">
                      {String(realIndex + 1).padStart(2, "0")}
                    </span>

                    {c.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.images[0]}
                        alt=""
                        className="h-12 w-16 object-cover bg-ink/5 shrink-0"
                      />
                    ) : (
                      <span className="h-12 w-16 bg-ink/5 shrink-0 grid place-items-center text-[11px] text-ink/30">
                        bez fotky
                      </span>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {c.cs?.title || <span className="text-ink/35">Bez názvu</span>}
                      </p>
                      <p className="text-[12.5px] text-ink/45 truncate">
                        /{c.slug || "—"} · {c.images?.length || 0} fotek
                      </p>
                    </div>

                    <button
                      onClick={() => togglePublish(c.id)}
                      className={`text-[12px] px-2.5 py-1 border transition-colors ${
                        c.published
                          ? "border-brand bg-brand/15 text-ink"
                          : "border-ink/15 text-ink/45"
                      }`}
                      title="Publikováno na webu?"
                    >
                      {c.published ? "Publikováno" : "Skryto"}
                    </button>
                    <button
                      onClick={() => setEditingId(c.id)}
                      className="text-[13px] px-3 py-1.5 border border-ink/15 hover:border-ink transition-colors"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => duplicate(c.id)}
                      className="text-[13px] text-ink/45 hover:text-ink px-1"
                      title="Duplikovat"
                    >
                      ⧉
                    </button>
                    <button
                      onClick={() => remove(c.id)}
                      className="text-[13px] text-ink/35 hover:text-red-600 px-1"
                      title="Smazat"
                    >
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>

            {shown.length === 0 && (
              <p className="text-ink/45 py-10 text-center">Nic nenalezeno.</p>
            )}
          </>
        )}

        {tab === "cases" && editing && (
          <CaseEditor
            item={editing}
            categories={data.categories}
            onBack={() => setEditingId(null)}
            onChange={(patch) =>
              update((d) => {
                const i = d.cases.findIndex((c) => c.id === editing.id);
                d.cases[i] = { ...d.cases[i], ...patch };
                return d;
              })
            }
            slugify={slugify}
          />
        )}
      </main>

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-3 text-[14px] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
