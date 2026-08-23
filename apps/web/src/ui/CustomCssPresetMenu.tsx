import { Check, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CUSTOM_CSS_PRESETS,
  type CustomCssPreset
} from "./custom-css-presets";

export function CustomCssPresetMenu({
  currentCss,
  onApply
}: {
  currentCss: string;
  onApply: (css: string) => void;
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const applyPreset = (preset: CustomCssPreset) => {
    const name = t(`overlay.customCssPreset.${preset.id}`);

    setExpanded(false);
    if (window.confirm(t("overlay.applyCustomCssPresetConfirm", { name }))) {
      onApply(preset.css);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        title={t("overlay.customCssPresets")}
        aria-label={t("overlay.customCssPresets")}
        aria-haspopup="menu"
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
        className="inline-flex size-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
      >
        <Sparkles aria-hidden="true" size={16} />
      </button>

      {expanded ? (
        <div
          role="menu"
          aria-label={t("overlay.customCssPresets")}
          className="absolute left-0 top-full z-40 mt-1 w-56 overflow-hidden rounded-md border border-white/10 bg-slate-950 py-1 shadow-xl shadow-black/40"
        >
          {CUSTOM_CSS_PRESETS.map((preset) => {
            const selected = currentCss === preset.css;

            return (
              <button
                key={preset.id}
                type="button"
                role="menuitem"
                onClick={() => applyPreset(preset)}
                className={`flex min-h-10 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition ${selected ? "bg-emerald-400/10 text-emerald-200" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}
              >
                <span>{t(`overlay.customCssPreset.${preset.id}`)}</span>
                {selected ? (
                  <Check aria-hidden="true" size={16} className="shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
