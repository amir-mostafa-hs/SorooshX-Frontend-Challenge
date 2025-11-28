"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Locale, localeDirection } from "@/i18n/config"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  dir: "ltr" | "rtl"
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const dir = localeDirection[locale]

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    window.location.reload()
  }

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  return <LocaleContext.Provider value={{ locale, setLocale, dir }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
