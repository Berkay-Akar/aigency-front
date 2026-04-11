import en from "@/messages/en.json";
import tr from "@/messages/tr.json";

export const locales = ["en", "tr"] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

const catalog = {
  en,
  tr,
} as const;

export function getMessages(locale: AppLocale) {
  return catalog[locale] ?? catalog.en;
}

export function isAppLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}
