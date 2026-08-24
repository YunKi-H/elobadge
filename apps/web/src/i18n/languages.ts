export const languageDefinitions = {
  ko: {
    nativeName: "한국어",
    locale: "ko-KR"
  },
  en: {
    nativeName: "English",
    locale: "en-GB"
  },
  de: {
    nativeName: "Deutsch",
    locale: "de-DE"
  },
  es: {
    nativeName: "Español",
    locale: "es-ES"
  },
  fr: {
    nativeName: "Français",
    locale: "fr-FR"
  },
  "pt-BR": {
    nativeName: "Português (Brasil)",
    locale: "pt-BR"
  },
  ru: {
    nativeName: "Русский",
    locale: "ru-RU"
  },
  hi: {
    nativeName: "हिन्दी",
    locale: "hi-IN"
  },
  id: {
    nativeName: "Indonesia",
    locale: "id-ID"
  },
  it: {
    nativeName: "Italiano",
    locale: "it-IT"
  },
  ja: {
    nativeName: "日本語",
    locale: "ja-JP"
  },
  pl: {
    nativeName: "Polski",
    locale: "pl-PL"
  },
  tr: {
    nativeName: "Türkçe",
    locale: "tr-TR"
  },
  uk: {
    nativeName: "Українська",
    locale: "uk-UA"
  },
  vi: {
    nativeName: "Tiếng Việt",
    locale: "vi-VN"
  },
  "zh-CN": {
    nativeName: "中文 (简体)",
    locale: "zh-CN"
  },
  "zh-TW": {
    nativeName: "中文 (繁體)",
    locale: "zh-TW"
  }
} as const;

export type SupportedLanguage = keyof typeof languageDefinitions;

const nativeNameCollator = new Intl.Collator("en", {
  sensitivity: "base"
});

export const supportedLanguages = (
  Object.keys(languageDefinitions) as SupportedLanguage[]
).sort((left, right) =>
  nativeNameCollator.compare(
    languageDefinitions[left].nativeName,
    languageDefinitions[right].nativeName
  )
);

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

  if (baseLanguage === "zh") {
    const subtags = normalized.split("-").slice(1);
    const usesTraditionalChinese = subtags.some((subtag) =>
      ["hant", "tw", "hk", "mo"].includes(subtag)
    );
    const chineseVariant = usesTraditionalChinese ? "zh-TW" : "zh-CN";

    if (supportedLanguages.includes(chineseVariant)) {
      return chineseVariant;
    }
  }

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
