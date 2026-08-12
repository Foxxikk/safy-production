"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext({ theme: "light", toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("bx-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    // bez uložené volby respektujeme nastavení systému
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);

  const toggle = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      window.localStorage.setItem("bx-theme", next);
      return next;
    });
  };

  return (
    <ThemeCtx.Provider value={{ theme, toggle }}>
      <div className={`bx-theme ${theme === "dark" ? "dark" : ""}`}>{children}</div>
    </ThemeCtx.Provider>
  );
}
