"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTradingStore } from "@/store/trading-store"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ChevronDown, Download, User } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

const tradingPairs = [
  { symbol: "BTC/USDT", name: "Bitcoin" },
  { symbol: "ETH/USDT", name: "Ethereum" },
  { symbol: "SOL/USDT", name: "Solana" },
  { symbol: "XRP/USDT", name: "Ripple" },
  { symbol: "DOGE/USDT", name: "Dogecoin" },
]

export function Header() {
  const { marketData, selectedPair, setSelectedPair } = useTradingStore()
  const t = useTranslations("common")
  const tMarket = useTranslations("market")

  return (
    <header className="border-b border-border">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link href="/">
              <img className="w-30 h-5" src="/sorooshx-logo.png" alt="SorooshX Logo" />
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
      <div className="flex items-center gap-4 px-4 py-2 overflow-x-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto">
              <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center">
                <span className="text-[10px] font-bold text-foreground">₿</span>
              </div>
              <span className="font-semibold text-foreground">{selectedPair}</span>
              <span className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{tMarket("perp")}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 bg-popover border-border">
            <div className="space-y-1">
              {tradingPairs.map((pair) => (
                <button
                  key={pair.symbol}
                  onClick={() => setSelectedPair(pair.symbol)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-start hover:bg-accent transition-colors ${
                    selectedPair === pair.symbol ? "bg-accent" : ""
                  }`}
                >
                  <span className="font-medium text-foreground">{pair.symbol}</span>
                  <span className="text-xs text-muted-foreground">{pair.name}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-xl font-bold text-trading-green">${marketData.price.toLocaleString()}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("change24h")}</span>
            <span className="text-trading-green font-medium">
              +{marketData.change24h}({marketData.changePercent24h}%)
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("high24h")}</span>
            <span className="text-foreground font-medium">{marketData.high24h.toLocaleString()}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("low24h")}</span>
            <span className="text-foreground font-medium">{marketData.low24h.toLocaleString()}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("volumeBtc")}</span>
            <span className="text-foreground font-medium">{marketData.volumeBtc24h}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{tMarket("volumeUsdt")}</span>
            <span className="text-foreground font-medium">{marketData.volumeUsdt24h}M</span>
          </div>

          <div className="flex flex-col ms-auto">
            <span className="text-xs text-muted-foreground">{tMarket("fundingSettlement")}</span>
            <span className="text-trading-red font-medium">-0.0074% / 04:37:00</span>
          </div>
        </div>
      </div>
    </header>
  )
}
