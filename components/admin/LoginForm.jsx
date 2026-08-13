"use client";

import { useState } from "react";
import { Button, Field, TextInput } from "./ui";
import { IconLock } from "./Icons";

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
    <div className="min-h-screen bg-[#f7f7f6] flex items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="bg-white border border-ink/[0.09] p-8">
          <span className="inline-grid h-10 w-10 place-items-center border border-ink/10 text-ink/40">
            <IconLock size={18} />
          </span>
          <h1 className="mt-5 text-[22px] font-semibold leading-tight">ŠAFY BX</h1>
          <p className="text-[13.5px] text-ink/45 mt-1">Administrace webu</p>

          <form onSubmit={submit} className="mt-7">
            <Field label="Heslo" error={error || null}>
              <TextInput
                id="pw"
                type="password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button
              type="submit"
              variant="primary"
              disabled={busy || !password}
              className="mt-5 w-full"
            >
              {busy ? "Přihlašuji…" : "Přihlásit se"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
