"use client";

const Field = ({ label, hint, value, onChange, type = "text", placeholder }) => (
  <label className="block">
    <span className="block text-[12.5px] text-ink/50 mb-1.5">{label}</span>
    <input
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-ink/15 bg-white px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ink transition-colors"
    />
    {hint && <span className="block mt-1 text-[12px] text-ink/35">{hint}</span>}
  </label>
);

const Card = ({ title, note, children }) => (
  <section className="bg-white border border-ink/10 p-6 md:p-7">
    <h2 className="text-[17px] font-medium">{title}</h2>
    {note && <p className="text-[13px] text-ink/45 mt-1">{note}</p>}
    <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
  </section>
);

export default function SettingsEditor({ data, update }) {
  const s = data.settings || {};
  const set = (k) => (v) =>
    update((d) => {
      d.settings = { ...(d.settings || {}), [k]: v };
      return d;
    });

  const cats = data.categories?.cs || {};

  return (
    <div className="max-w-[900px] space-y-5">
      <Card title="Kontaktní údaje" note="Zobrazují se v patičce a u kontaktního formuláře.">
        <Field label="Název firmy" value={s.company} onChange={set("company")} />
        <Field label="Adresa" value={s.address} onChange={set("address")} />
        <Field label="IČO" value={s.ico} onChange={set("ico")} />
        <Field label="Telefon" value={s.phone} onChange={set("phone")} placeholder="+420 …" />
        <Field label="Hlavní e-mail" type="email" value={s.email} onChange={set("email")} />
        <Field
          label="E-mail na casting"
          type="email"
          value={s.emailCasting}
          onChange={set("emailCasting")}
          hint="Nechte prázdné, pokud se nemá zobrazovat."
        />
      </Card>

      <Card title="SEO" note="Titulek a popis stránky pro Google a náhledy odkazů.">
        <Field label="Titulek stránky" value={s.seoTitle} onChange={set("seoTitle")} />
        <label className="block sm:col-span-2">
          <span className="block text-[12.5px] text-ink/50 mb-1.5">Popis stránky</span>
          <textarea
            rows={3}
            value={s.seoDescription ?? ""}
            onChange={(e) => set("seoDescription")(e.target.value)}
            className="w-full border border-ink/15 bg-white px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ink transition-colors resize-none"
          />
          <span className="block mt-1 text-[12px] text-ink/35">
            Ideálně do 160 znaků — teď {(s.seoDescription || "").length}.
          </span>
        </label>
      </Card>

      <Card title="Zobrazení webu">
        <label className="flex items-start gap-3 sm:col-span-2">
          <input
            type="checkbox"
            checked={s.showStats !== false}
            onChange={(e) => set("showStats")(e.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="block text-[14.5px]">Zobrazit sekci „Čísla za námi“</span>
            <span className="block text-[12.5px] text-ink/45">
              Statistiky pod výpisem referencí. Obsah upravíte v Textech webu.
            </span>
          </span>
        </label>

        <label className="block">
          <span className="block text-[12.5px] text-ink/50 mb-1.5">
            Počet referencí na úvodní stránce
          </span>
          <input
            type="number"
            min={0}
            value={s.perPage ?? 0}
            onChange={(e) => set("perPage")(Number(e.target.value))}
            className="w-full border border-ink/15 bg-white px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ink transition-colors"
          />
          <span className="block mt-1 text-[12px] text-ink/35">0 = zobrazit všechny.</span>
        </label>
      </Card>

      <Card title="Kategorie referencí" note="Názvy filtrů nad výpisem projektů.">
        {Object.keys(cats).map((key) => (
          <div key={key} className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[12.5px] text-ink/50 mb-1.5">Česky ({key})</span>
              <input
                value={data.categories.cs[key] ?? ""}
                onChange={(e) =>
                  update((d) => {
                    d.categories.cs[key] = e.target.value;
                    return d;
                  })
                }
                className="w-full border border-ink/15 bg-white px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ink"
              />
            </label>
            <label className="block">
              <span className="block text-[12.5px] text-ink/50 mb-1.5">Anglicky</span>
              <input
                value={data.categories.en?.[key] ?? ""}
                onChange={(e) =>
                  update((d) => {
                    d.categories.en[key] = e.target.value;
                    return d;
                  })
                }
                className="w-full border border-ink/15 bg-white px-3.5 py-2.5 text-[14.5px] outline-none focus:border-ink"
              />
            </label>
          </div>
        ))}
      </Card>
    </div>
  );
}
