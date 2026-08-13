"use client";

/**
 * Sdílené stavební prvky administrace — aby všechny obrazovky vypadaly stejně.
 * Ostré rohy (brand), tenké linky, žádná zelená na plochách.
 */

/* ——— Tlačítka ——— */

const VARIANTS = {
  primary: "bg-ink text-white hover:bg-ink/85 disabled:hover:bg-ink",
  secondary: "bg-white border border-ink/15 text-ink hover:border-ink/45",
  ghost: "text-ink/55 hover:text-ink hover:bg-ink/[0.05]",
  danger: "bg-white border border-ink/15 text-ink/60 hover:border-red-300 hover:text-red-600",
};

const SIZES = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-[14px] gap-2",
};

export function Button({
  as: Tag = "button",
  variant = "secondary",
  size = "md",
  icon: Icon,
  children,
  className = "",
  ...rest
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </Tag>
  );
}

/** Čtvercové tlačítko jen s ikonou — pro akce v řádcích. */
export function IconButton({ icon: Icon, label, danger = false, className = "", ...rest }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-grid h-8 w-8 place-items-center transition-colors ${
        danger ? "text-ink/35 hover:text-red-600 hover:bg-red-50" : "text-ink/40 hover:text-ink hover:bg-ink/[0.06]"
      } ${className}`}
      {...rest}
    >
      <Icon size={16} />
    </button>
  );
}

/* ——— Karty a sekce ——— */

export function Card({ title, description, action, children, className = "" }) {
  return (
    <section className={`bg-white border border-ink/[0.09] ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 py-4 border-b border-ink/[0.07]">
          <div>
            <h2 className="text-[15px] font-medium leading-tight">{title}</h2>
            {description && <p className="text-[12.5px] text-ink/45 mt-0.5">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ——— Formulářová pole ——— */

export const inputCls =
  "w-full border border-ink/15 bg-white px-3 py-2.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-ink focus:ring-2 focus:ring-ink/[0.07]";

export function Field({ label, hint, error, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-[12.5px] font-medium text-ink/60 mb-1.5">{label}</span>}
      {children}
      {hint && !error && <span className="block mt-1 text-[12px] text-ink/40">{hint}</span>}
      {error && <span className="block mt-1 text-[12px] text-red-600">{error}</span>}
    </label>
  );
}

export function TextInput({ className = "", ...rest }) {
  return <input className={`${inputCls} ${className}`} {...rest} />;
}

export function TextArea({ className = "", rows = 3, ...rest }) {
  return <textarea rows={rows} className={`${inputCls} resize-y ${className}`} {...rest} />;
}

export function Select({ className = "", children, ...rest }) {
  return (
    <select className={`${inputCls} ${className}`} {...rest}>
      {children}
    </select>
  );
}

/** Přepínač zapnuto/vypnuto — čitelnější než holý checkbox. */
export function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 text-left group"
    >
      <span
        className={`mt-0.5 relative h-5 w-9 shrink-0 border transition-colors ${
          checked ? "bg-ink border-ink" : "bg-white border-ink/25 group-hover:border-ink/45"
        }`}
      >
        <span
          className={`absolute top-[2px] h-[14px] w-[14px] transition-all ${
            checked ? "left-[19px] bg-white" : "left-[2px] bg-ink/35"
          }`}
        />
      </span>
      <span>
        <span className="block text-[14px]">{label}</span>
        {description && <span className="block text-[12.5px] text-ink/45 mt-0.5">{description}</span>}
      </span>
    </button>
  );
}

/** Přepínač mezi několika hodnotami (jazyk, filtr…). */
export function SegmentedControl({ value, onChange, options, className = "" }) {
  return (
    <div className={`inline-flex border border-ink/15 bg-white p-0.5 ${className}`}>
      {options.map((o) => {
        const key = o.value ?? o;
        const label = o.label ?? o;
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`px-3 h-8 text-[13px] font-medium transition-colors ${
              active ? "bg-ink text-white" : "text-ink/50 hover:text-ink"
            }`}
          >
            {label}
            {o.count != null && (
              <span className={`ml-1.5 tabular-nums ${active ? "text-white/55" : "text-ink/30"}`}>
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Stavový štítek — publikováno / skryto apod. */
export function Badge({ tone = "muted", children }) {
  const tones = {
    muted: "border-ink/15 text-ink/45",
    solid: "border-ink/25 bg-ink/[0.05] text-ink",
    alert: "border-amber-300 bg-amber-50 text-amber-800",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 h-6 text-[11.5px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Prázdný stav s ikonou. */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="border border-dashed border-ink/15 bg-white/50 py-14 px-6 text-center">
      {Icon && (
        <span className="inline-grid h-11 w-11 place-items-center border border-ink/10 text-ink/25 mb-4">
          <Icon size={20} />
        </span>
      )}
      <p className="text-[15px] font-medium">{title}</p>
      {description && <p className="text-[13.5px] text-ink/45 mt-1 max-w-[42ch] mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
