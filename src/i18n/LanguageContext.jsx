import React, { createContext, useCallback, useContext, useState } from "react";
import { translations } from "./translations";

const LANG_KEY = "bp-admin-lang";

function getInitialLang() {
  if (typeof window === "undefined") return "uz";
  const saved = window.localStorage.getItem(LANG_KEY);
  return saved === "en" || saved === "ru" || saved === "uz" ? saved : "uz";
}

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((code) => {
    if (code !== "en" && code !== "ru" && code !== "uz") return;
    setLangState(code);
    window.localStorage.setItem(LANG_KEY, code);
    if (typeof document !== "undefined") document.documentElement.lang = code;
  }, []);

  const t = useCallback(
    (key, vars = {}) => {
      let str = translations[lang]?.[key] ?? translations.en[key] ?? key;
      for (const [k, v] of Object.entries(vars)) {
        str = str.replaceAll(`{${k}}`, String(v ?? ""));
      }
      return str;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
