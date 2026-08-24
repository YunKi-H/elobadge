export const languageDefinitions = {
  ko: {
    nativeName: "한국어",
    flag: "🇰🇷",
    locale: "ko-KR"
  },
  en: {
    nativeName: "English",
    flag: "🇬🇧",
    locale: "en-GB"
  }
} as const;

export type SupportedLanguage = keyof typeof languageDefinitions;

export const supportedLanguages = Object.keys(
  languageDefinitions
) as SupportedLanguage[];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
export const FALLBACK_LANGUAGE: SupportedLanguage = "ko";

export function matchSupportedLanguage(
  language: string | null | undefined
): SupportedLanguage | null {
  if (!language) {
    return null;
  }

  const normalized = language.toLowerCase();
  const exactMatch = supportedLanguages.find(
    (candidate) => normalized === candidate.toLowerCase()
  );

  if (exactMatch) {
    return exactMatch;
  }

  const baseLanguage = normalized.split("-")[0];
  return (
    supportedLanguages.find(
      (candidate) =>
        candidate.toLowerCase().split("-")[0] === baseLanguage
    ) ?? null
  );
}

export function resolveSupportedLanguage(
  language: string | null | undefined
): SupportedLanguage {
  return matchSupportedLanguage(language) ?? DEFAULT_LANGUAGE;
}

export function languageLocale(language: string | null | undefined): string {
  return languageDefinitions[resolveSupportedLanguage(language)].locale;
}
