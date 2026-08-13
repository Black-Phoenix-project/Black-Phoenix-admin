import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

const THEME_KEY = "bp-admin-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const { t } = useLanguage();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="w-9 h-9 rounded-xl flex items-center justify-center border border-base-300 text-base-content/70 hover:text-warning hover:border-warning/40 transition-all active:scale-90"
      title={theme === "dark" ? t("theme.lightMode") : t("theme.darkMode")}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
