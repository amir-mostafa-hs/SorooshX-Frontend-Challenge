"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLocale } from "@/components/locale-provider"
import { locales, localeNames } from "@/i18n/config"
import { Globe, Check } from "lucide-react"
import { useTranslations } from "next-intl"

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const t = useTranslations("language")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
          <Globe className="w-4 h-4" />
          <span className="text-xs font-medium">{localeNames[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border-border">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => setLocale(loc)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{t(loc)}</span>
            {locale === loc && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
