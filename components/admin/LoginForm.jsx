"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Přihlášení se nezdařilo.");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="text-[12px] tracking-[0.2em] text-ink/40">[ŠAFY BX]</p>
        <h1 className="mt-3 text-2xl font-medium">Administrace</h1>
        <label className="mt-8 block text-[13px] text-ink/60" htmlFor="pw">
          Heslo
        </label>
        <input
          id="pw"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full border border-ink/15 bg-white px-4 py-3 outline-none focus:border-ink transition-colors"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full bg-ink text-white py-3 font-medium hover:bg-brand hover:text-ink transition-colors disabled:opacity-50"
        >
          {busy ? "Přihlašuji…" : "Přihlásit se"}
        </button>
      </form>
    </div>
  );
}
