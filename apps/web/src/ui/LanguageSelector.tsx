import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  supportedLanguages,
  type SupportedLanguage
} from "../i18n";

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  ko: "🇰🇷",
  en: "🇬🇧"
};

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const language: SupportedLanguage = i18n.resolvedLanguage === "en"
    ? "en"
    : "ko";

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [expanded]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls="language-options"
        aria-label={t("language.label")}
        onClick={() => setExpanded((current) => !current)}
        className="flex h-9 min-w-28 items-center justify-between gap-2 rounded-md border border-white/10 bg-slate-900 px-2.5 text-sm font-medium text-slate-200 outline-none transition hover:border-white/25 hover:bg-slate-800 focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400/30"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span aria-hidden="true" className="shrink-0 text-base leading-none">
            {LANGUAGE_FLAGS[language]}
          </span>
          <span className="truncate">{t(`language.${language}`)}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          size={15}
          className={`shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded ? (
        <div
          id="language-options"
          role="listbox"
          aria-label={t("language.label")}
          className="absolute right-0 top-full z-40 mt-1 w-40 overflow-hidden rounded-md border border-white/10 bg-slate-950 py-1 shadow-xl shadow-black/40"
        >
          {supportedLanguages.map((value) => {
            const selected = value === language;

            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  void i18n.changeLanguage(value);
                  setExpanded(false);
                }}
                className={`flex min-h-10 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium transition ${selected ? "bg-emerald-400/10 text-emerald-200" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-base leading-none"
                  >
                    {LANGUAGE_FLAGS[value]}
                  </span>
                  <span className="truncate">{t(`language.${value}`)}</span>
                </span>
                {selected ? (
                  <Check aria-hidden="true" className="shrink-0" size={16} />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
