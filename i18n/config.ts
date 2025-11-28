export type Locale = "en" | "fa"

export const locales: Locale[] = ["en", "fa"]
export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "EN",
  fa: "FA",
}

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fa: "rtl",
}
