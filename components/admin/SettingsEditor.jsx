"use client";

import { Card, Field, TextArea, TextInput, Toggle } from "./ui";

export default function SettingsEditor({ data, update }) {
  const s = data.settings || {};
  const set = (k) => (v) =>
    update((d) => {
      d.settings = { ...(d.settings || {}), [k]: v };
      return d;
    });

  const cats = Object.keys(data.categories?.cs || {});
  const seoLen = (s.seoDescription || "").length;

  return (
    <div className="max-w-[820px] space-y-5">
      <Card title="Kontaktní údaje" description="Zobrazují se v patičce a u kontaktního formuláře.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Název firmy">
            <TextInput value={s.company ?? ""} onChange={(e) => set("company")(e.target.value)} />
          </Field>
          <Field label="Adresa">
            <TextInput value={s.address ?? ""} onChange={(e) => set("address")(e.target.value)} />
          </Field>
          <Field label="IČO">
            <TextInput value={s.ico ?? ""} onChange={(e) => set("ico")(e.target.value)} />
          </Field>
          <Field label="Telefon" hint="Nechte prázdné, pokud se nemá zobrazovat.">
            <TextInput
              value={s.phone ?? ""}
              placeholder="+420 …"
              onChange={(e) => set("phone")(e.target.value)}
            />
          </Field>
          <Field label="Hlavní e-mail">
            <TextInput
              type="email"
              value={s.email ?? ""}
              onChange={(e) => set("email")(e.target.value)}
            />
          </Field>
          <Field label="E-mail na casting" hint="Nechte prázdné, pokud se nemá zobrazovat.">
            <TextInput
              type="email"
              value={s.emailCasting ?? ""}
              onChange={(e) => set("emailCasting")(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      <Card title="SEO" description="Jak se stránka ukáže ve vyhledávání a v náhledech odkazů.">
        <Field label="Titulek stránky">
          <TextInput value={s.seoTitle ?? ""} onChange={(e) => set("seoTitle")(e.target.value)} />
        </Field>
        <Field
          label="Popis stránky"
          hint={`${seoLen} znaků — ideálně do 160.`}
          error={seoLen > 165 ? `Popis je o ${seoLen - 160} znaků delší, než Google zobrazí.` : null}
          className="mt-4"
        >
          <TextArea
            value={s.seoDescription ?? ""}
            onChange={(e) => set("seoDescription")(e.target.value)}
          />
        </Field>
      </Card>

      <Card title="Zobrazení webu">
        <Toggle
          checked={s.showStats !== false}
          onChange={set("showStats")}
          label="Zobrazit sekci „Čísla za námi“"
          description="Statistiky pod výpisem referencí. Obsah upravíte v Textech webu."
        />
        <Field
          label="Počet referencí na úvodní stránce"
          hint="0 = zobrazit všechny."
          className="mt-5 max-w-[240px]"
        >
          <TextInput
            type="number"
            min={0}
            value={s.perPage ?? 0}
            onChange={(e) => set("perPage")(Number(e.target.value))}
          />
        </Field>
      </Card>

      <Card title="Kategorie referencí" description="Názvy filtrů nad výpisem projektů.">
        <div className="space-y-3">
          {cats.map((key) => (
            <div key={key} className="grid gap-3 sm:grid-cols-[110px_1fr_1fr] sm:items-center">
              <span className="text-[12.5px] text-ink/40 font-mono">{key}</span>
              <TextInput
                value={data.categories.cs[key] ?? ""}
                placeholder="Česky"
                onChange={(e) =>
                  update((d) => {
                    d.categories.cs[key] = e.target.value;
                    return d;
                  })
                }
              />
              <TextInput
                value={data.categories.en?.[key] ?? ""}
                placeholder="Anglicky"
                onChange={(e) =>
                  update((d) => {
                    d.categories.en[key] = e.target.value;
                    return d;
                  })
                }
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
