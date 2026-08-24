import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { loadLocale } from "./i18n/locale-loaders";
import {
  DEFAULT_LANGUAGE,
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

const LANGUAGE_STORAGE_KEY = "elobadge-language";

export const i18nReady = initializeI18n();

export async function changeAppLanguage(language: string): Promise<void> {
  await i18nReady;

  const supportedLanguage = resolveSupportedLanguage(language);

  if (!i18n.hasResourceBundle(supportedLanguage, "translation")) {
    const translation = await loadLocale(supportedLanguage);
    i18n.addResourceBundle(
      supportedLanguage,
      "translation",
      translation,
      true,
      true
    );
  }

  await i18n.changeLanguage(supportedLanguage);
}

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

i18n.on("languageChanged", applyLanguage);

async function initializeI18n(): Promise<void> {
  const requestedLanguage = readInitialLanguage();
  const { language, translation } = await loadInitialLocale(requestedLanguage);

  await i18n.use(initReactI18next).init({
    resources: {
      [language]: { translation }
    },
    lng: language,
    fallbackLng: false,
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false
    }
  });
}

async function loadInitialLocale(language: SupportedLanguage): Promise<{
  language: SupportedLanguage;
  translation: object;
}> {
  try {
    return {
      language,
      translation: await loadLocale(language)
    };
  } catch (error) {
    if (language === DEFAULT_LANGUAGE) {
      throw error;
    }

    console.error(`Failed to load locale: ${language}`, error);
    return {
      language: DEFAULT_LANGUAGE,
      translation: await loadLocale(DEFAULT_LANGUAGE)
    };
  }
}

export default i18n;
