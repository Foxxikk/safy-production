"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ui } from "../../lib/bx";

const LangContext = createContext({ lang: "cs", setLang: () => {}, t: ui.cs });

export function LangProvider({ children }) {
  const [lang, setLang] = useState("cs");

  useEffect(() => {
    const saved = window.localStorage.getItem("bx-lang");
    if (saved === "cs" || saved === "en") setLang(saved);
  }, []);

  const change = (l) => {
    setLang(l);
    window.localStorage.setItem("bx-lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang: change, t: ui[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
