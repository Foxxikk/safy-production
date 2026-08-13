"use client";

import { useEffect, useMemo, useState } from "react";

const fmt = (iso) =>
  new Date(iso).toLocaleString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function Leads({ onCount }) {
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState("inbox"); // inbox | unread | archived
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

  const shown = useMemo(() => {
    const l = leads || [];
    if (filter === "archived") return l.filter((x) => x.archived);
    if (filter === "unread") return l.filter((x) => !x.read && !x.archived);
    return l.filter((x) => !x.archived);
  }, [leads, filter]);

  const open = (leads || []).find((l) => l.id === openId) || null;

  const exportCsv = () => {
    const rows = [
      ["Datum", "Jméno", "Firma", "E-mail", "Telefon", "Typ", "Rozpočet", "Zpráva"],
      ...(leads || []).map((l) => [
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

  if (leads === null) return <p className="text-ink/45 py-10">Načítám poptávky…</p>;

  // ——— Detail poptávky ———
  if (open) {
    return (
      <div className="max-w-[820px]">
        <button
          onClick={() => setOpenId(null)}
          className="text-[13.5px] text-ink/50 hover:text-ink mb-5"
        >
          ← Zpět na seznam
        </button>

        <div className="bg-white border border-ink/10 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[22px] font-medium">{open.name}</h2>
              {open.company && <p className="text-ink/55 mt-0.5">{open.company}</p>}
              <p className="text-[13px] text-ink/40 mt-2">{fmt(open.createdAt)}</p>
            </div>
            <a
              href={`mailto:${open.email}?subject=${encodeURIComponent(
                "ŠAFY BX — vaše poptávka"
              )}`}
              className="bg-ink text-white px-4 py-2 text-[14px] hover:bg-ink/85 transition-colors"
            >
              Odpovědět e-mailem
            </a>
          </div>

          <dl className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2 text-[14.5px]">
            {[
              ["E-mail", <a key="e" href={`mailto:${open.email}`} className="underline underline-offset-4">{open.email}</a>],
              ["Telefon", open.phone ? <a key="p" href={`tel:${open.phone}`} className="underline underline-offset-4">{open.phone}</a> : "—"],
              ["Typ projektu", open.type || "—"],
              ["Rozpočet", open.budget || "—"],
              ["Jazyk", open.lang === "en" ? "Angličtina" : "Čeština"],
              ["Odesláno ze stránky", open.source || "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[12px] text-ink/40 mb-0.5">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          {open.message && (
            <div className="mt-7 border-t border-ink/10 pt-5">
              <p className="text-[12px] text-ink/40 mb-2">Zpráva</p>
              <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{open.message}</p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-2 border-t border-ink/10 pt-5">
            <button
              onClick={() => act(open.read ? "unread" : "read", open.id)}
              disabled={busy}
              className="border border-ink/15 px-3.5 py-2 text-[13.5px] hover:border-ink transition-colors"
            >
              {open.read ? "Označit jako nepřečtené" : "Označit jako přečtené"}
            </button>
            <button
              onClick={() => act(open.archived ? "unarchive" : "archive", open.id)}
              disabled={busy}
              className="border border-ink/15 px-3.5 py-2 text-[13.5px] hover:border-ink transition-colors"
            >
              {open.archived ? "Vrátit z archivu" : "Archivovat"}
            </button>
            <button
              onClick={() => {
                if (!confirm("Opravdu smazat tuto poptávku?")) return;
                act("delete", open.id);
                setOpenId(null);
              }}
              disabled={busy}
              className="text-[13.5px] text-ink/40 hover:text-red-600 px-2"
            >
              Smazat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ——— Seznam ———
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-1">
          {[
            ["inbox", "Doručené"],
            ["unread", "Nepřečtené"],
            ["archived", "Archiv"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3.5 py-2 text-[13.5px] transition-colors ${
                filter === k ? "bg-ink text-white" : "text-ink/55 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="border border-ink/15 px-3.5 py-2 text-[13.5px] hover:border-ink transition-colors"
          >
            Obnovit
          </button>
          <button
            onClick={exportCsv}
            disabled={!leads.length}
            className="border border-ink/15 px-3.5 py-2 text-[13.5px] hover:border-ink transition-colors disabled:opacity-40"
          >
            Export CSV
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="border border-dashed border-ink/15 py-16 text-center text-ink/45">
          <p>Zatím tu nic není.</p>
          <p className="text-[13px] mt-1">
            Poptávky z formuláře na webu se objeví tady.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {shown.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => {
                  setOpenId(l.id);
                  if (!l.read) act("read", l.id);
                }}
                className="w-full flex items-center gap-4 bg-white border border-ink/10 px-4 py-3.5 text-left hover:border-ink/30 transition-colors"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    l.read ? "bg-transparent border border-ink/20" : "bg-brand"
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate ${l.read ? "" : "font-medium"}`}>
                    {l.name}
                    {l.company && <span className="text-ink/45"> · {l.company}</span>}
                  </span>
                  <span className="block text-[13px] text-ink/45 truncate">
                    {l.type || "Bez typu"}
                    {l.budget && ` · ${l.budget}`}
                    {l.message && ` · ${l.message.slice(0, 70)}`}
                  </span>
                </span>
                <span className="hidden sm:block text-[12.5px] text-ink/40 shrink-0 tabular-nums">
                  {fmt(l.createdAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
