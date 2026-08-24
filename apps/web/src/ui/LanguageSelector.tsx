import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  changeAppLanguage,
  languageDefinitions,
  resolveSupportedLanguage,
  supportedLanguages,
  type SupportedLanguage
} from "../i18n";

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [pendingLanguage, setPendingLanguage] =
    useState<SupportedLanguage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const language = resolveSupportedLanguage(i18n.resolvedLanguage);
  const selectedLanguage = languageDefinitions[language];

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
        aria-busy={pendingLanguage !== null}
        disabled={pendingLanguage !== null}
        onClick={() => setExpanded((current) => !current)}
        className="flex h-9 min-w-28 items-center justify-between gap-2 rounded-md border border-white/10 bg-slate-900 px-2.5 text-sm font-medium text-slate-200 outline-none transition hover:border-white/25 hover:bg-slate-800 focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400/30"
      >
        <span className="truncate">{selectedLanguage.nativeName}</span>
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
          className="absolute right-0 top-full z-40 mt-1 max-h-[min(70vh,32rem)] w-48 overflow-y-auto rounded-md border border-white/10 bg-slate-950 py-1 shadow-xl shadow-black/40"
        >
          {supportedLanguages.map((value) => {
            const selected = value === language;
            const definition = languageDefinitions[value];

            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={selected}
                disabled={pendingLanguage !== null}
                onClick={() => {
                  setPendingLanguage(value);
                  void changeAppLanguage(value)
                    .then(() => {
                      setExpanded(false);
                    })
                    .catch((error: unknown) => {
                      console.error(`Failed to change locale: ${value}`, error);
                    })
                    .finally(() => {
                      setPendingLanguage(null);
                    });
                }}
                className={`flex min-h-10 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium transition ${selected ? "bg-emerald-400/10 text-emerald-200" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="truncate">{definition.nativeName}</span>
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
