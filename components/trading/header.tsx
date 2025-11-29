"use client"

import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ChevronDown, Download, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import MarketInfo from "./market-info"
import Image from "next/image"



export function Header() {
  const t = useTranslations("common")

  return (
    <header className="border-b border-border">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image className="w-30 h-5" src="/sorooshx-logo.png" alt="SorooshX Logo" width={120} height={20} />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("home")}
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {t("trade")} <ChevronDown className="w-3 h-3" />
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("ideas")}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("support")}
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("downloads")}
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {t("more")} <ChevronDown className="w-3 h-3" />
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <User className="w-4 h-4 me-2" />
            {t("account")}
          </Button>
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Market Info Bar */}
      <MarketInfo />
    </header>
  )
}
