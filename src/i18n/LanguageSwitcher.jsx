import React from "react";
import { Check } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { languageOptions } from "./translations";
import { FLAGS } from "./Flags";

const LanguageSwitcher = ({ vertical = false }) => {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`flex gap-1.5 ${vertical ? "flex-col w-full" : "flex-row flex-wrap"}`}>
      {languageOptions.map((opt) => {
        const active = lang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLang(opt.code)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.97] border-2 ${
              vertical ? "w-full" : "justify-center flex-1"
            } ${
              active
                ? "bg-warning text-warning-content border-warning shadow-sm"
                : "bg-base-200 text-base-content/70 border-transparent hover:border-warning/40 hover:text-base-content"
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="shrink-0 leading-none">{FLAGS[opt.code]}</span>
              <span className="truncate">{opt.label}</span>
            </span>
            {active && vertical && (
              <span className="ml-auto shrink-0 bg-white/25 rounded-full p-0.5">
                <Check size={12} strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
