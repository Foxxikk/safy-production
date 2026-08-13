"use client";

import { useEffect, useState } from "react";
import { Button, Card, EmptyState } from "./ui";
import {
  IconAlert,
  IconImage,
  IconInbox,
  IconPlus,
  IconProjects,
  IconSettings,
  IconText,
  IconCheck,
} from "./Icons";

const Stat = ({ icon: Icon, value, label, note }) => (
  <div className="bg-white border border-ink/[0.09] p-5">
    <span className="inline-grid h-8 w-8 place-items-center border border-ink/10 text-ink/35">
      <Icon size={16} />
    </span>
    <div className="mt-4 text-[28px] leading-none font-semibold tabular-nums">{value}</div>
    <p className="mt-2 text-[13.5px]">{label}</p>
    {note && <p className="text-[12.5px] text-ink/40 mt-0.5">{note}</p>}
  </div>
);

export default function Dashboard({ data, savedAt, go, onAddCase }) {
  const [leads, setLeads] = useState(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => (r.ok ? r.json() : { leads: [] }))
      .then((d) => setLeads(d.leads || []))
      .catch(() => setLeads([]));
  }, []);

  const cases = data.cases || [];
  const published = cases.filter((c) => c.published !== false);
  const hidden = cases.length - published.length;
  const noPhoto = cases.filter((c) => !c.images?.length);
  const noEn = cases.filter((c) => !c.en?.title?.trim());
  const unread = (leads || []).filter((l) => !l.read && !l.archived);
  const recent = (leads || []).filter((l) => !l.archived).slice(0, 5);
  const issues = [
    noPhoto.length && {
      text: `${noPhoto.length} ${noPhoto.length === 1 ? "reference nemá" : "referencí nemá"} fotku`,
      detail: noPhoto.map((c) => c.cs?.title || c.slug).slice(0, 3).join(", "),
    },
    noEn.length && {
      text: `${noEn.length} ${noEn.length === 1 ? "reference nemá" : "referencí nemá"} anglický název`,
      detail: noEn.map((c) => c.cs?.title || c.slug).slice(0, 3).join(", "),
    },
  ].filter(Boolean);

  return (
    <div className="max-w-[1000px] space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={IconProjects}
          value={published.length}
          label="Publikovaných referencí"
          note={hidden > 0 ? `${hidden} skrytých` : "Vše publikováno"}
        />
        <Stat
          icon={IconInbox}
          value={leads === null ? "—" : unread.length}
          label="Nepřečtených poptávek"
          note={leads === null ? "Načítám…" : `${leads.length} celkem`}
        />
        <Stat
          icon={IconImage}
          value={cases.reduce((n, c) => n + (c.images?.length || 0), 0)}
          label="Fotek v galeriích"
        />
        <Stat
          icon={IconCheck}
          value={savedAt ? new Date(savedAt).toLocaleDateString("cs-CZ") : "—"}
          label="Naposledy publikováno"
          note={
            savedAt
              ? new Date(savedAt).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })
              : "Zatím neuloženo"
          }
        />
      </div>

      {/* Rychlé akce */}
      <Card title="Rychlé akce">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" icon={IconPlus} onClick={onAddCase}>
            Nová reference
          </Button>
          <Button icon={IconInbox} onClick={() => go("leads")}>
            Poptávky
            {unread.length > 0 && <span className="text-ink/45">({unread.length})</span>}
          </Button>
          <Button icon={IconText} onClick={() => go("texts")}>
            Texty webu
          </Button>
          <Button icon={IconSettings} onClick={() => go("settings")}>
            Nastavení
          </Button>
        </div>
      </Card>

      {issues.length > 0 && (
        <Card title="Vyžaduje pozornost" description="Drobnosti, které stojí za doplnění.">
          <ul className="space-y-3">
            {issues.map((it) => (
              <li key={it.text} className="flex items-start justify-between gap-4">
                <span className="flex items-start gap-2.5 text-[14px]">
                  <IconAlert size={16} className="mt-0.5 text-amber-500" />
                  <span>
                    {it.text}
                    {it.detail && <span className="block text-[12.5px] text-ink/40">{it.detail}</span>}
                  </span>
                </span>
                <Button size="sm" onClick={() => go("cases")}>
                  Otevřít
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card
        title="Poslední poptávky"
        action={
          <Button size="sm" onClick={() => go("leads")}>
            Zobrazit všechny
          </Button>
        }
      >
        {leads === null ? (
          <p className="text-ink/40 text-[14px]">Načítám…</p>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={IconInbox}
            title="Zatím žádné poptávky"
            description="Až někdo odešle formulář na webu, objeví se tady."
          />
        ) : (
          <ul className="divide-y divide-ink/[0.07] -my-1">
            {recent.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go("leads")}
                  className="w-full flex items-center gap-3 py-2.5 text-[14px] text-left hover:text-ink/70 transition-colors"
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 ${l.read ? "bg-ink/15" : "bg-ink"}`}
                    title={l.read ? "Přečteno" : "Nepřečteno"}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    <span className={l.read ? "" : "font-medium"}>{l.name}</span>
                    {l.company && <span className="text-ink/45"> · {l.company}</span>}
                  </span>
                  <span className="shrink-0 text-[12.5px] text-ink/40">
                    {new Date(l.createdAt).toLocaleDateString("cs-CZ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
