import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./i18n/locales/en";
import ko from "./i18n/locales/ko";
import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  matchSupportedLanguage,
  resolveSupportedLanguage,
  supportedLanguages,
  type SupportedLanguage
} from "./i18n/languages";

export {
  languageDefinitions,
  languageLocale,
  matchSupportedLanguage,
  resolveSupportedLanguage,
  supportedLanguages,
  type SupportedLanguage
} from "./i18n/languages";

const resources = {
  ko: { translation: ko },
  en: { translation: en }
} satisfies Record<SupportedLanguage, { translation: object }>;

const LANGUAGE_STORAGE_KEY = "elobadge-language";

void i18n.use(initReactI18next).init({
  resources,
  lng: readInitialLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false
  }
});

function readInitialLanguage(): SupportedLanguage {
  const stored = matchSupportedLanguage(
    window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  );

  if (stored) {
    return stored;
  }

  for (const language of window.navigator.languages) {
    const supportedLanguage = matchSupportedLanguage(language);

    if (supportedLanguage) {
      return supportedLanguage;
    }
  }

  return DEFAULT_LANGUAGE;
}

function applyLanguage(language: string): void {
  const supportedLanguage = resolveSupportedLanguage(language);
  document.documentElement.lang = supportedLanguage;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, supportedLanguage);
}

applyLanguage(i18n.language);
i18n.on("languageChanged", applyLanguage);

export default i18n;
