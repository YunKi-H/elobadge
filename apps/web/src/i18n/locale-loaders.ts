import type { SupportedLanguage } from "./languages";

type LocaleModule = { default: object };
type LocaleLoader = () => Promise<LocaleModule>;

export const localeLoaders = {
  ko: () => import("./locales/ko"),
  en: () => import("./locales/en"),
  de: () => import("./locales/de"),
  es: () => import("./locales/es"),
  fr: () => import("./locales/fr"),
  "pt-BR": () => import("./locales/pt-BR"),
  ru: () => import("./locales/ru"),
  hi: () => import("./locales/hi"),
  id: () => import("./locales/id"),
  it: () => import("./locales/it"),
  ja: () => import("./locales/ja"),
  pl: () => import("./locales/pl"),
  tr: () => import("./locales/tr"),
  uk: () => import("./locales/uk"),
  vi: () => import("./locales/vi"),
  "zh-CN": () => import("./locales/zh-CN"),
  "zh-TW": () => import("./locales/zh-TW")
} satisfies Record<SupportedLanguage, LocaleLoader>;

export async function loadLocale(
  language: SupportedLanguage
): Promise<object> {
  return (await localeLoaders[language]()).default;
}
