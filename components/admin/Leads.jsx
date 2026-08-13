"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, EmptyState, IconButton } from "./ui";
import {
  IconArchive,
  IconArrowLeft,
  IconDownload,
  IconEye,
  IconEyeOff,
  IconInbox,
  IconMail,
  IconPhone,
  IconRefresh,
  IconTrash,
} from "./Icons";

const fmt = (iso) =>
  new Date(iso).toLocaleString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const relative = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600) return `před ${Math.max(1, Math.round(diff / 60))} min`;
  if (diff < 86400) return `před ${Math.round(diff / 3600)} h`;
  if (diff < 172800) return "včera";
  return new Date(iso).toLocaleDateString("cs-CZ");
};

export default function Leads({ onCount }) {
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState("inbox");
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/leads");
    if (!res.ok) return setLeads([]);
    const d = await res.json();
    setLeads(d.leads || []);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (leads && onCount) onCount(leads.filter((l) => !l.read && !l.archived).length);
  }, [leads, onCount]);

  const act = async (action, ids) => {
    setBusy(true);
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids }),
    });
    setBusy(false);
    if (res.ok) {
      const d = await res.json();
      setLeads(d.leads || []);
    }
  };

  const all = leads || [];
  const counts = {
    inbox: all.filter((x) => !x.archived).length,
    unread: all.filter((x) => !x.read && !x.archived).length,
    archived: all.filter((x) => x.archived).length,
  };

  const shown = useMemo(() => {
    if (filter === "archived") return all.filter((x) => x.archived);
    if (filter === "unread") return all.filter((x) => !x.read && !x.archived);
    return all.filter((x) => !x.archived);
  }, [all, filter]);

  const open = all.find((l) => l.id === openId) || null;

  const exportCsv = () => {
    const rows = [
      ["Datum", "Jméno", "Firma", "E-mail", "Telefon", "Typ", "Rozpočet", "Zpráva"],
      ...all.map((l) => [
        fmt(l.createdAt),
        l.name,
        l.company,
        l.email,
        l.phone,
        l.type,
        l.budget,
        (l.message || "").replace(/\s+/g, " "),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `safy-bx-poptavky-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (leads === null) {
    return <p className="text-ink/40 py-10 text-[14px]">Načítám poptávky…</p>;
  }

  // ——— Detail ———
  if (open) {
    const rows = [
      { label: "E-mail", value: open.email, href: `mailto:${open.email}` },
      { label: "Telefon", value: open.phone, href: open.phone ? `tel:${open.phone}` : null },
      { label: "Typ projektu", value: open.type },
      { label: "Orientační rozpočet", value: open.budget },
      { label: "Jazyk formuláře", value: open.lang === "en" ? "Angličtina" : "Čeština" },
      { label: "Odesláno ze stránky", value: open.source },
    ];

    return (
      <div className="max-w-[760px]">
        <Button icon={IconArrowLeft} variant="ghost" size="sm" onClick={() => setOpenId(null)} className="mb-4 -ml-3">
          Zpět na seznam
        </Button>

        <div className="bg-white border border-ink/[0.09]">
          <header className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-ink/[0.07]">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[20px] font-semibold leading-tight">{open.name}</h2>
                {open.archived && <Badge>Archiv</Badge>}
              </div>
              {open.company && <p className="text-ink/55 mt-0.5">{open.company}</p>}
              <p className="text-[12.5px] text-ink/40 mt-1.5">
                {fmt(open.createdAt)} · {relative(open.createdAt)}
              </p>
            </div>
            <Button
              as="a"
              variant="primary"
              icon={IconMail}
              href={`mailto:${open.email}?subject=${encodeURIComponent("ŠAFY BX — vaše poptávka")}`}
            >
              Odpovědět
            </Button>
          </header>

          <dl className="px-6 py-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 text-[14.5px]">
            {rows.map((r) => (
              <div key={r.label}>
                <dt className="text-[12px] text-ink/40 mb-0.5">{r.label}</dt>
                <dd>
                  {r.value ? (
                    r.href ? (
                      <a href={r.href} className="inline-flex items-center gap-1.5 hover:text-ink/60 underline underline-offset-4 decoration-ink/20">
                        {r.label === "Telefon" ? <IconPhone size={14} /> : <IconMail size={14} />}
                        {r.value}
                      </a>
                    ) : (
                      r.value
                    )
                  ) : (
                    <span className="text-ink/30">neuvedeno</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {open.message && (
            <div className="px-6 py-5 border-t border-ink/[0.07]">
              <p className="text-[12px] text-ink/40 mb-2">Zpráva</p>
              <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{open.message}</p>
            </div>
          )}

          <footer className="flex flex-wrap gap-2 px-6 py-4 border-t border-ink/[0.07] bg-ink/[0.015]">
            <Button
              size="sm"
              icon={open.read ? IconEyeOff : IconEye}
              disabled={busy}
              onClick={() => act(open.read ? "unread" : "read", open.id)}
            >
              {open.read ? "Označit jako nepřečtené" : "Označit jako přečtené"}
            </Button>
            <Button
              size="sm"
              icon={IconArchive}
              disabled={busy}
              onClick={() => act(open.archived ? "unarchive" : "archive", open.id)}
            >
              {open.archived ? "Vrátit z archivu" : "Archivovat"}
            </Button>
            <Button
              size="sm"
              variant="danger"
              icon={IconTrash}
              disabled={busy}
              onClick={() => {
                if (!confirm("Opravdu smazat tuto poptávku?")) return;
                act("delete", open.id);
                setOpenId(null);
              }}
            >
              Smazat
            </Button>
          </footer>
        </div>
      </div>
    );
  }

  // ——— Seznam ———
  return (
    <div className="max-w-[1000px]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex border border-ink/15 bg-white p-0.5">
          {[
            ["inbox", "Doručené", counts.inbox],
            ["unread", "Nepřečtené", counts.unread],
            ["archived", "Archiv", counts.archived],
          ].map(([k, label, count]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3.5 h-8 text-[13px] font-medium transition-colors ${
                filter === k ? "bg-ink text-white" : "text-ink/50 hover:text-ink"
              }`}
            >
              {label}
              <span className={`ml-1.5 tabular-nums ${filter === k ? "text-white/50" : "text-ink/30"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" icon={IconRefresh} onClick={load}>
            Obnovit
          </Button>
          <Button size="sm" icon={IconDownload} onClick={exportCsv} disabled={!all.length}>
            Export CSV
          </Button>
        </div>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon={IconInbox}
          title={
            filter === "archived"
              ? "Archiv je prázdný"
              : filter === "unread"
              ? "Vše je přečtené"
              : "Zatím žádné poptávky"
          }
          description={
            filter === "inbox"
              ? "Až někdo odešle formulář na webu, objeví se tady i s kontaktem a rozpočtem."
              : undefined
          }
        />
      ) : (
        <div className="bg-white border border-ink/[0.09]">
          {shown.map((l, n) => (
            <div
              key={l.id}
              className={`group flex items-center gap-3 transition-colors hover:bg-ink/[0.02] ${
                n > 0 ? "border-t border-ink/[0.07]" : ""
              }`}
            >
              <button
                onClick={() => {
                  setOpenId(l.id);
                  if (!l.read) act("read", l.id);
                }}
                className="flex-1 min-w-0 flex items-center gap-3 pl-4 py-3 text-left"
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 ${l.read ? "bg-ink/15" : "bg-ink"}`}
                  title={l.read ? "Přečteno" : "Nepřečteno"}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={`truncate ${l.read ? "" : "font-semibold"}`}>{l.name}</span>
                    {l.company && <span className="text-ink/45 truncate">· {l.company}</span>}
                  </span>
                  <span className="block text-[13px] text-ink/45 truncate mt-0.5">
                    {[l.type, l.budget, l.message].filter(Boolean).join(" · ").slice(0, 110) ||
                      "Bez dalších údajů"}
                  </span>
                </span>
                <span className="hidden sm:block text-[12.5px] text-ink/40 shrink-0 tabular-nums">
                  {relative(l.createdAt)}
                </span>
              </button>
              <div className="flex items-center pr-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <IconButton
                  icon={IconArchive}
                  label={l.archived ? "Vrátit z archivu" : "Archivovat"}
                  onClick={() => act(l.archived ? "unarchive" : "archive", l.id)}
                />
                <IconButton
                  icon={IconTrash}
                  label="Smazat"
                  danger
                  onClick={() => {
                    if (confirm("Opravdu smazat tuto poptávku?")) act("delete", l.id);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
