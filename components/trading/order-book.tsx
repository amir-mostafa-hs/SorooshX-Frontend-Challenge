"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSelectCoin from "@/lib/hooks/useSelectCoin"
import { formatPrice } from "@/lib/utils"
import { useTradingStore } from "@/store/trading-store"
import { useTranslations } from "next-intl"

export function OrderBook() {
  const { asks, bids } = useTradingStore()
  const selectedCoin = useSelectCoin().selectedCoin
  const t = useTranslations("orderBook")

  // Calculate max total for depth visualization
  const maxTotal = Math.max(...asks.map((a) => a.total), ...bids.map((b) => b.total))

  return (
    <Card className="flex flex-col h-full bg-card border-border">
      <Tabs defaultValue="orderbook" className="flex flex-col h-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0 h-auto">
          <TabsTrigger
            value="orderbook"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-sm"
          >
            {t("title")}
          </TabsTrigger>
          <TabsTrigger
            value="trades"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2 text-sm"
          >
            {t("tradeHistory")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orderbook" className="flex-1 flex flex-col mt-0 p-2">
          {/* Display mode buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button className="flex gap-0.5">
              <div className="w-3 h-3 bg-trading-red rounded-sm" />
              <div className="w-3 h-3 bg-trading-red rounded-sm opacity-60" />
            </button>
            <button className="flex gap-0.5 opacity-40">
              <div className="w-3 h-3 bg-trading-red rounded-sm" />
              <div className="w-3 h-3 bg-trading-green rounded-sm" />
            </button>
            <button className="flex gap-0.5 opacity-40">
              <div className="w-3 h-3 bg-trading-green rounded-sm" />
              <div className="w-3 h-3 bg-trading-green rounded-sm opacity-60" />
            </button>
            <span className="ms-auto text-xs text-muted-foreground">0.01 ▾</span>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground px-1 py-1">
            <span>{t("price")}</span>
            <span className="text-end">{t("amountBtc")}</span>
            <span className="text-end">{t("totalBtc")}</span>
          </div>

          {/* Asks (Sells) */}
          <div className="flex-1 overflow-hidden">
            <div className="space-y-0.5">
              {asks.map((ask, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-xs px-1 py-0.5 relative">
                  <div
                    className="absolute inset-y-0 end-0 bg-trading-red/20"
                    style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                  />
                  <span className="text-trading-red relative z-10">{ask.price.toFixed(1)}</span>
                  <span className="text-end text-foreground relative z-10">{ask.amount.toFixed(2)}</span>
                  <span className="text-end text-foreground relative z-10">{ask.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Price */}
          <div className="py-2 text-center border-y border-border my-1">
            <span className="text-xl font-bold text-foreground">${formatPrice(selectedCoin?.current_price)}</span>
          </div>

          {/* Bids (Buys) */}
          <div className="flex-1 overflow-hidden">
            <div className="space-y-0.5">
              {bids.map((bid, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 text-xs px-1 py-0.5 relative">
                  <div
                    className="absolute inset-y-0 end-0 bg-trading-green/20"
                    style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                  />
                  <span className="text-trading-green relative z-10">{bid.price.toFixed(1)}</span>
                  <span className="text-end text-foreground relative z-10">{bid.amount.toFixed(2)}</span>
                  <span className="text-end text-foreground relative z-10">{bid.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Depth indicator */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
            <span className="text-xs text-trading-green">75%</span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-trading-red" style={{ width: "28%" }} />
            </div>
            <span className="text-xs text-trading-red">28%</span>
          </div>
        </TabsContent>

        <TabsContent value="trades" className="flex-1 p-2">
          <div className="text-center text-muted-foreground text-sm py-8">{t("tradeHistoryPlaceholder")}</div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
