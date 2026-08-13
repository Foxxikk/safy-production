"use client";

import { useEffect, useState } from "react";

const Stat = ({ value, label, note }) => (
  <div className="bg-white border border-ink/10 p-5">
    <div className="text-[30px] leading-none font-medium tabular-nums">{value}</div>
    <p className="mt-2 text-[13.5px]">{label}</p>
    {note && <p className="text-[12.5px] text-ink/40 mt-0.5">{note}</p>}
  </div>
);

export default function Dashboard({ data, savedAt, go }) {
  const [leads, setLeads] = useState(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => (r.ok ? r.json() : { leads: [] }))
      .then((d) => setLeads(d.leads || []))
      .catch(() => setLeads([]));
  }, []);

  const cases = data.cases || [];
  const published = cases.filter((c) => c.published !== false);
  const noPhoto = cases.filter((c) => !c.images?.length);
  const noEn = cases.filter((c) => !c.en?.title?.trim());
  const unread = (leads || []).filter((l) => !l.read && !l.archived);
  const recent = (leads || []).filter((l) => !l.archived).slice(0, 5);

  return (
    <div className="max-w-[980px]">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          value={published.length}
          label="Publikovaných referencí"
          note={cases.length - published.length > 0 ? `${cases.length - published.length} skrytých` : "Vše publikováno"}
        />
        <Stat
          value={leads === null ? "…" : unread.length}
          label="Nepřečtených poptávek"
          note={leads === null ? "" : `${leads.length} celkem`}
        />
        <Stat
          value={cases.reduce((n, c) => n + (c.images?.length || 0), 0)}
          label="Fotek v galeriích"
        />
        <Stat
          value={savedAt ? new Date(savedAt).toLocaleDateString("cs-CZ") : "—"}
          label="Naposledy publikováno"
          note={savedAt ? new Date(savedAt).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }) : "Zatím neuloženo"}
        />
      </div>

      {/* Co je potřeba dořešit */}
      {(noPhoto.length > 0 || noEn.length > 0) && (
        <section className="mt-5 bg-white border border-ink/10 p-6">
          <h2 className="text-[17px] font-medium">Vyžaduje pozornost</h2>
          <ul className="mt-3 space-y-2 text-[14px]">
            {noPhoto.length > 0 && (
              <li className="flex items-center justify-between gap-4 border-b border-ink/[0.07] pb-2">
                <span>
                  <strong className="font-medium">{noPhoto.length}</strong> referencí je bez fotky
                  <span className="text-ink/45"> — {noPhoto.map((c) => c.cs?.title || c.slug).slice(0, 3).join(", ")}</span>
                </span>
                <button onClick={() => go("cases")} className="shrink-0 text-ink/50 hover:text-ink underline underline-offset-4">
                  Otevřít
                </button>
              </li>
            )}
            {noEn.length > 0 && (
              <li className="flex items-center justify-between gap-4">
                <span>
                  <strong className="font-medium">{noEn.length}</strong> referencí nemá anglický název
                </span>
                <button onClick={() => go("cases")} className="shrink-0 text-ink/50 hover:text-ink underline underline-offset-4">
                  Otevřít
                </button>
              </li>
            )}
          </ul>
        </section>
      )}

      {/* Poslední poptávky */}
      <section className="mt-5 bg-white border border-ink/10 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-medium">Poslední poptávky</h2>
          <button onClick={() => go("leads")} className="text-[13.5px] text-ink/50 hover:text-ink underline underline-offset-4">
            Zobrazit všechny
          </button>
        </div>
        {leads === null ? (
          <p className="text-ink/40 text-[14px] mt-4">Načítám…</p>
        ) : recent.length === 0 ? (
          <p className="text-ink/45 text-[14px] mt-4">
            Zatím žádné. Poptávky z formuláře na webu se objeví tady.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-ink/[0.07]">
            {recent.map((l) => (
              <li key={l.id} className="flex items-center gap-3 py-2.5 text-[14px]">
                <span className={`h-2 w-2 shrink-0 rounded-full ${l.read ? "border border-ink/20" : "bg-brand"}`} />
                <span className="min-w-0 flex-1 truncate">
                  {l.name}
                  {l.company && <span className="text-ink/45"> · {l.company}</span>}
                </span>
                <span className="shrink-0 text-[12.5px] text-ink/40">
                  {new Date(l.createdAt).toLocaleDateString("cs-CZ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
