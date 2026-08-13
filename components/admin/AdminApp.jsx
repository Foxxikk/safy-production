"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CaseEditor from "./CaseEditor";
import TextsEditor from "./TextsEditor";
import SettingsEditor from "./SettingsEditor";
import Dashboard from "./Dashboard";
import Leads from "./Leads";
import { Badge, Button, EmptyState, IconButton, TextInput } from "./ui";
import {
  IconCheck,
  IconClose,
  IconCopy,
  IconDashboard,
  IconEdit,
  IconExternal,
  IconEye,
  IconEyeOff,
  IconGrip,
  IconImage,
  IconInbox,
  IconLogout,
  IconMenu,
  IconPlus,
  IconProjects,
  IconSearch,
  IconSettings,
  IconText,
  IconTrash,
} from "./Icons";

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
  { key: "dashboard", label: "Přehled", icon: IconDashboard },
  { key: "cases", label: "Reference", icon: IconProjects },
  { key: "leads", label: "Poptávky", icon: IconInbox },
  { key: "texts", label: "Texty webu", icon: IconText },
  { key: "settings", label: "Nastavení", icon: IconSettings },
];

const TITLES = {
  dashboard: ["Přehled", "Souhrn obsahu a poptávek."],
  cases: ["Reference", "Projekty na webu. Pořadí změníte přetažením řádku."],
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
  const [toast, setToast] = useState(null);
  const [unread, setUnread] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const dragFrom = useRef(null);

  const update = useCallback((fn) => {
    setData((d) => (typeof fn === "function" ? fn(structuredClone(d)) : fn));
    setDirty(true);
  }, []);

  const flash = (message, tone = "ok") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => (r.ok ? r.json() : { leads: [] }))
      .then((d) => setUnread((d.leads || []).filter((l) => !l.read && !l.archived).length))
      .catch(() => setUnread(0));
  }, []);

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
      flash("Změny jsou publikované na webu");
    } else {
      flash("Uložení se nezdařilo, zkuste to prosím znovu", "error");
    }
  };

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
    setTab("cases");
    setEditingId(c.id);
  };

  const duplicate = (id) => {
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
    flash("Kopie vytvořena — najdete ji hned pod originálem");
  };

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
    <div className="min-h-screen bg-[#f7f7f6] lg:flex">
      {/* ——— Boční menu ——— */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[244px] bg-white border-r border-ink/[0.09] flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:shrink-0 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 h-[60px] flex items-center justify-between border-b border-ink/[0.07]">
          <span className="flex items-baseline gap-2">
            <span className="font-semibold tracking-tight">ŠAFY BX</span>
            <span className="text-[10px] tracking-[0.16em] text-ink/35">ADMIN</span>
          </span>
          <IconButton
            icon={IconClose}
            label="Zavřít menu"
            onClick={() => setNavOpen(false)}
            className="lg:hidden"
          />
        </div>

        <nav className="flex-1 p-2.5 space-y-0.5">
          {NAV.map((n) => {
            const active = tab === n.key;
            const badge = n.key === "leads" && unread ? unread : null;
            return (
              <button
                key={n.key}
                onClick={() => goTo(n.key)}
                className={`w-full flex items-center gap-3 px-3 h-10 text-[14px] text-left transition-colors ${
                  active
                    ? "bg-ink text-white font-medium"
                    : "text-ink/65 hover:text-ink hover:bg-ink/[0.05]"
                }`}
              >
                <n.icon size={17} className={active ? "" : "text-ink/40"} />
                <span className="flex-1">{n.label}</span>
                {n.key === "cases" && (
                  <span className={`text-[12px] tabular-nums ${active ? "text-white/50" : "text-ink/30"}`}>
                    {cases.length}
                  </span>
                )}
                {badge && (
                  <span className="min-w-[20px] h-5 grid place-items-center bg-ink text-white text-[11px] font-semibold tabular-nums px-1.5">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-2.5 border-t border-ink/[0.07] space-y-0.5">
          <a
            href="/safy-bx"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 h-10 text-[13.5px] text-ink/55 hover:text-ink hover:bg-ink/[0.05] transition-colors"
          >
            <IconExternal size={16} className="text-ink/35" />
            Zobrazit web
          </a>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 px-3 h-10 text-[13.5px] text-ink/55 hover:text-ink hover:bg-ink/[0.05] transition-colors"
          >
            <IconLogout size={16} className="text-ink/35" />
            Odhlásit se
          </button>
        </div>
      </aside>

      {navOpen && (
        <button
          aria-label="Zavřít menu"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
        />
      )}

      {/* ——— Obsah ——— */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-[#f7f7f6]/90 backdrop-blur-md border-b border-ink/[0.08]">
          <div className="px-4 md:px-7 h-[60px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <IconButton
                icon={IconMenu}
                label="Menu"
                onClick={() => setNavOpen(true)}
                className="lg:hidden border border-ink/15"
              />
              <div className="min-w-0">
                <h1 className="text-[16px] font-semibold truncate leading-tight">
                  {editing ? editing.cs?.title || "Nová reference" : title}
                </h1>
                <p className="text-[12.5px] text-ink/45 truncate hidden sm:block">
                  {editing ? "Úprava reference" : subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:flex items-center gap-1.5 text-[12.5px] text-ink/45">
                {dirty ? (
                  <>
                    <span className="h-1.5 w-1.5 bg-amber-500" />
                    Neuložené změny
                  </>
                ) : savedAt ? (
                  <>
                    <IconCheck size={13} className="text-ink/35" />
                    Uloženo {new Date(savedAt).toLocaleString("cs-CZ")}
                  </>
                ) : (
                  "Zatím neuloženo"
                )}
              </span>
              <Button variant="primary" onClick={save} disabled={!dirty || saving}>
                {saving ? "Ukládám…" : "Publikovat změny"}
              </Button>
            </div>
          </div>
        </header>

        <main className="px-4 md:px-7 py-6 md:py-7">
          {tab === "dashboard" && (
            <Dashboard data={data} savedAt={savedAt} go={goTo} onAddCase={addCase} />
          )}

          {tab === "leads" && <Leads onCount={setUnread} />}

          {tab === "texts" && <TextsEditor data={data} update={update} />}

          {tab === "settings" && <SettingsEditor data={data} update={update} />}

          {tab === "cases" && !editing && (
            <div className="max-w-[1100px]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="relative w-full sm:w-80">
                  <IconSearch
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none"
                  />
                  <TextInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Hledat podle názvu nebo adresy…"
                    className="pl-9"
                  />
                </div>
                <Button variant="primary" icon={IconPlus} onClick={addCase}>
                  Nová reference
                </Button>
              </div>

              {shown.length === 0 ? (
                <EmptyState
                  icon={IconSearch}
                  title={query ? "Nic jsme nenašli" : "Zatím tu není žádná reference"}
                  description={
                    query
                      ? "Zkuste jiné slovo, nebo hledání zrušte."
                      : "Přidejte první projekt a objeví se na webu."
                  }
                  action={
                    query ? (
                      <Button onClick={() => setQuery("")}>Zrušit hledání</Button>
                    ) : (
                      <Button variant="primary" icon={IconPlus} onClick={addCase}>
                        Nová reference
                      </Button>
                    )
                  }
                />
              ) : (
                <div className="bg-white border border-ink/[0.09]">
                  {shown.map((c, n) => {
                    const realIndex = cases.findIndex((x) => x.id === c.id);
                    return (
                      <div
                        key={c.id}
                        draggable={!query}
                        onDragStart={onDragStart(realIndex)}
                        onDragOver={onDragOver(realIndex)}
                        onDragEnd={onDragEnd}
                        className={`group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-ink/[0.02] ${
                          n > 0 ? "border-t border-ink/[0.07]" : ""
                        }`}
                      >
                        <span
                          className={`text-ink/20 ${
                            query
                              ? "opacity-25"
                              : "cursor-grab active:cursor-grabbing group-hover:text-ink/45"
                          }`}
                          title={query ? "Pro řazení zrušte hledání" : "Přetáhněte pro změnu pořadí"}
                        >
                          <IconGrip size={16} />
                        </span>
                        <span className="w-5 text-[12px] text-ink/30 tabular-nums text-right">
                          {realIndex + 1}
                        </span>

                        {c.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.images[0]}
                            alt=""
                            className="h-11 w-16 object-cover bg-ink/5 shrink-0"
                          />
                        ) : (
                          <span className="h-11 w-16 bg-ink/[0.04] shrink-0 grid place-items-center text-ink/20">
                            <IconImage size={16} />
                          </span>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-[14.5px]">
                            {c.cs?.title || <span className="text-ink/30">Bez názvu</span>}
                          </p>
                          <p className="text-[12.5px] text-ink/40 truncate">
                            /{c.slug || "bez adresy"} · {c.images?.length || 0} fotek
                          </p>
                        </div>

                        <button
                          onClick={() => togglePublish(c.id)}
                          title={c.published ? "Skrýt z webu" : "Publikovat na web"}
                          className="shrink-0"
                        >
                          <Badge tone={c.published ? "solid" : "muted"}>
                            {c.published ? <IconEye size={13} /> : <IconEyeOff size={13} />}
                            <span className="hidden sm:inline">
                              {c.published ? "Publikováno" : "Skryto"}
                            </span>
                          </Badge>
                        </button>

                        <div className="flex items-center shrink-0">
                          <IconButton
                            icon={IconEdit}
                            label="Upravit"
                            onClick={() => setEditingId(c.id)}
                          />
                          <IconButton
                            icon={IconCopy}
                            label="Duplikovat"
                            onClick={() => duplicate(c.id)}
                          />
                          <IconButton
                            icon={IconTrash}
                            label="Smazat"
                            danger
                            onClick={() => remove(c.id)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 text-[14px] shadow-xl ${
            toast.tone === "error" ? "bg-red-600 text-white" : "bg-ink text-white"
          }`}
        >
          <IconCheck size={16} />
          {toast.message}
        </div>
      )}
    </div>
  );
}
