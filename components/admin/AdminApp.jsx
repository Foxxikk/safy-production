"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CaseEditor from "./CaseEditor";
import TextsEditor from "./TextsEditor";
import SettingsEditor from "./SettingsEditor";
import Dashboard from "./Dashboard";
import Leads from "./Leads";

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

const NAV = [
  { key: "dashboard", label: "Přehled", icon: "◫" },
  { key: "cases", label: "Reference", icon: "▤" },
  { key: "leads", label: "Poptávky", icon: "✉" },
  { key: "texts", label: "Texty webu", icon: "¶" },
  { key: "settings", label: "Nastavení", icon: "⚙" },
];

const TITLES = {
  dashboard: ["Přehled", "Souhrn obsahu a poptávek."],
  cases: ["Reference", "Projekty na webu — pořadí měníte přetažením."],
  leads: ["Poptávky", "Zprávy z kontaktního formuláře."],
  texts: ["Texty webu", "Úvodní text, pilíře a statistiky."],
  settings: ["Nastavení", "Kontakty, SEO a zobrazení webu."],
};

export default function AdminApp({ initialData }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState("dashboard");
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(initialData.updatedAt);
  const [toast, setToast] = useState("");
  const [unread, setUnread] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const dragFrom = useRef(null);

  const update = useCallback((fn) => {
    setData((d) => (typeof fn === "function" ? fn(structuredClone(d)) : fn));
    setDirty(true);
  }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  // Počet nepřečtených poptávek do bočního menu
  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => (r.ok ? r.json() : { leads: [] }))
      .then((d) => setUnread((d.leads || []).filter((l) => !l.read && !l.archived).length))
      .catch(() => setUnread(0));
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
      flash("Uložení se nezdařilo");
    }
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

  const goTo = (key) => {
    setTab(key);
    setEditingId(null);
    setNavOpen(false);
  };

  const [title, subtitle] = TITLES[tab] || ["", ""];

  return (
    <div className="min-h-screen bg-[#f6f6f5] lg:flex">
      {/* ——— Boční menu ——— */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[248px] bg-ink text-white flex flex-col transition-transform lg:translate-x-0 lg:static lg:shrink-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 h-16 flex items-center border-b border-white/10">
          <span className="font-medium tracking-tight">ŠAFY BX</span>
          <span className="ml-2 text-[11px] tracking-[0.16em] text-white/35">ADMIN</span>
        </div>

        <nav className="flex-1 py-3">
          {NAV.map((n) => {
            const active = tab === n.key;
            const badge = n.key === "leads" && unread ? unread : null;
            return (
              <button
                key={n.key}
                onClick={() => goTo(n.key)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-[14.5px] text-left transition-colors ${
                  active ? "bg-white/10 text-white" : "text-white/55 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  aria-hidden
                  className={`w-4 text-center text-[13px] ${active ? "text-brand" : "text-white/30"}`}
                >
                  {n.icon}
                </span>
                <span className="flex-1">{n.label}</span>
                {n.key === "cases" && (
                  <span className="text-[12px] text-white/30 tabular-nums">{cases.length}</span>
                )}
                {badge && (
                  <span className="bg-brand text-ink text-[11px] font-medium px-1.5 py-0.5 tabular-nums">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/safy-bx"
            target="_blank"
            rel="noreferrer"
            className="block text-[13.5px] text-white/55 hover:text-white transition-colors"
          >
            Zobrazit web ↗
          </a>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.reload();
            }}
            className="block text-[13.5px] text-white/40 hover:text-white transition-colors"
          >
            Odhlásit se
          </button>
        </div>
      </aside>

      {navOpen && (
        <button
          aria-label="Zavřít menu"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* ——— Obsah ——— */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-[#f6f6f5]/95 backdrop-blur border-b border-ink/10">
          <div className="px-4 md:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setNavOpen(true)}
                aria-label="Menu"
                className="lg:hidden h-9 w-9 border border-ink/15 grid place-items-center"
              >
                ☰
              </button>
              <div className="min-w-0">
                <h1 className="text-[17px] font-medium truncate">
                  {editing ? "Úprava reference" : title}
                </h1>
                <p className="text-[12.5px] text-ink/45 truncate hidden sm:block">
                  {editing ? editing.cs?.title || "Nová reference" : subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:block text-[12.5px] text-ink/45">
                {dirty
                  ? "Neuložené změny"
                  : savedAt
                  ? `Uloženo ${new Date(savedAt).toLocaleString("cs-CZ")}`
                  : "Zatím neuloženo"}
              </span>
              <button
                onClick={save}
                disabled={!dirty || saving}
                className="bg-ink text-white px-4 md:px-5 py-2 text-[14px] font-medium hover:bg-ink/85 transition-colors disabled:opacity-30"
              >
                {saving ? "Ukládám…" : "Uložit a publikovat"}
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 md:px-8 py-6 md:py-8">
          {tab === "dashboard" && <Dashboard data={data} savedAt={savedAt} go={goTo} />}

          {tab === "leads" && <Leads onCount={setUnread} />}

          {tab === "texts" && <TextsEditor data={data} update={update} />}

          {tab === "settings" && <SettingsEditor data={data} update={update} />}

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
                  className="bg-white border border-ink/20 px-5 py-2.5 text-[14px] font-medium hover:border-ink transition-colors"
                >
                  + Nová reference
                </button>
              </div>

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
                            ? "border-ink/25 bg-ink/[0.06] text-ink"
                            : "border-ink/15 text-ink/40"
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

              {shown.length === 0 && <p className="text-ink/45 py-10 text-center">Nic nenalezeno.</p>}
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
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-ink text-white px-5 py-3 text-[14px] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
